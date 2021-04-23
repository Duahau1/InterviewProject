import React, { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, Button, Badge } from "react-bootstrap";
import useDebounce from "./debounce";
import "../App.css";
import carsData from "./cars.json";
const List = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [displayCars, setDisplayCar] = useState(carsData.slice(0, PAGE_SIZE));
  const [searchResult, setSearchResult] = useState([]);
  const [searchUse, setSearchUse] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  //To prevent lagging from searching by delaying given ms
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      setSearchResult(liveSearch(debouncedSearchTerm));
      setSearchUse(true);
    } else {
      setSearchResult([]);
      setSearchUse(false);
    }
  }, [debouncedSearchTerm]);

  //Add a search string to apply regex later for live search
  carsData.forEach((car) => {
    car.searchKey = Object.values(car)
      .join(" ")
      .replace("[object Object]", Object.values(car.lot).join(" "));
  });
  //To make a list for the pagination
  function makeList() {
    let startIndex = (currentPage - 1) * PAGE_SIZE;
    let endIndex = startIndex + PAGE_SIZE;
    setDisplayCar(carsData.slice(startIndex, endIndex));
  }
  function nextHandler() {
    setCurrentPage(currentPage + 1);
    makeList();
  }
  function prevHandler() {
    setCurrentPage(currentPage - 1);
    makeList();
  }
  function firstHandler() {
    setCurrentPage(1);
    makeList();
  }
  function lastHandler() {
    setCurrentPage(Math.ceil(carsData.length / PAGE_SIZE));
    makeList();
  }
  function liveSearch(term) {
    let regex = new RegExp(term, "gim");
    let searchResult = [];
    carsData.forEach((car) => {
      if (regex.test(car.searchKey)) {
        searchResult.push(car);
      }
    });
    return searchResult;
  }
  return (
    <div>
      <h2>
        Simple Car List <Badge variant="primary">New</Badge>
      </h2>
      <input
        id="searchBar"
        className="bar-styling"
        placeholder="Search"
        delay={2000}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {!searchUse ? (
        <div>
          <Accordion>
            {displayCars.map((car, index) => {
              return (
                <Card key={index}>
                  <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                    {`${car.make} - ${car.model} - Asking Price: $${car.askingPrice}`}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>
                      <Card.Text>
                        <ListGroup horizontal className="sell-info">
                          {Object.keys(car.lot).map((lot) => {
                            return (
                              <ListGroup.Item variant="info">
                                {lot.toUpperCase() + " : " + car.lot[lot]}
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </Card.Text>
                      <Card.Text>
                        <ListGroup>
                          <ListGroup.Item variant="light">
                            {`Color: ${car.color}`}
                          </ListGroup.Item>
                          <ListGroup.Item variant="light">
                            {`Dealer Cost: $${car.dealerCost}`}
                          </ListGroup.Item>
                          <ListGroup.Item variant="light">
                            {` Listed date: ${car.dateListed}`}
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Text>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })}
          </Accordion>
          <div style={{ margin: "1rem" }}>
            <Button
              variant="primary"
              onClick={firstHandler}
              style={{
                visibility: currentPage - 1 <= 0 ? "hidden" : "visible",
              }}
            >
              First Page
            </Button>{" "}
            <Button
              variant="primary"
              onClick={prevHandler}
              style={{
                visibility: currentPage - 1 <= 0 ? "hidden" : "visible",
              }}
            >
              Previous
            </Button>{" "}
            <span className="current-page">{currentPage}</span>
            <Button
              variant="primary"
              onClick={nextHandler}
              style={{
                visibility:
                  currentPage * PAGE_SIZE > carsData.length - 1
                    ? "hidden"
                    : "visible",
              }}
            >
              Next
            </Button>{" "}
            <Button
              variant="primary"
              onClick={lastHandler}
              style={{
                visibility:
                  currentPage * PAGE_SIZE > carsData.length - 1
                    ? "hidden"
                    : "visible",
              }}
            >
              Last Page
            </Button>{" "}
          </div>
        </div>
      ) : searchResult.length > 0 ? (
        <div>
          <Accordion>
            {searchResult.map((car, index) => {
              return (
                <Card key={index}>
                  <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                    {`${car.make} - ${car.model} - Asking Price: $${car.askingPrice}`}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>
                      <Card.Text>
                        <ListGroup horizontal className="sell-info">
                          {Object.keys(car.lot).map((lot) => {
                            return (
                              <ListGroup.Item variant="info">
                                {lot.toUpperCase() + " : " + car.lot[lot]}
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </Card.Text>
                      <Card.Text>
                        <ListGroup>
                          <ListGroup.Item variant="light">
                            {`Color: ${car.color}`}
                          </ListGroup.Item>
                          <ListGroup.Item variant="light">
                            {`Dealer Cost: $${car.dealerCost}`}
                          </ListGroup.Item>
                          <ListGroup.Item variant="light">
                            {` Listed date: ${car.dateListed}`}
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Text>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })}
          </Accordion>
        </div>
      ) : (
        <div>No Item Found</div>
      )}
    </div>
  );
};
export default List;
