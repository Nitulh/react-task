import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const Problem2 = () => {
  const [modalAVisible, setModalAVisible] = useState(false);
  const [modalBVisible, setModalBVisible] = useState(false);
  const [modalCVisible, setModalCVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTextModalA, setSearchTextModalA] = useState("");
  const [searchTextModalB, setSearchTextModalB] = useState("");
  const [onlyEvenID, setOnlyEvenID] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchContacts = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      setContacts(data.results);
      setFilteredContacts(data.results);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchAllContacts = () => {
    setModalAVisible(true);
    window.history.pushState({}, "", "/modal-a");
  };

  const fetchUSContacts = () => {
    setModalBVisible(true);
    window.history.pushState({}, "", "/modal-b");
  };

  useEffect(() => {
    if (modalAVisible) {
      fetchContacts("https://contact.mediusware.com/api/contacts/?page=1");
    } else if (modalBVisible) {
      fetchContacts(
        "https://contact.mediusware.com/api/country-contacts/United%20States/?page=1"
      );
    }
  }, [modalAVisible, modalBVisible]);

  const openModalC = (contact) => {
    setSelectedContact(contact);
    setModalCVisible(true);
  };

  const openModalA = () => {
    setModalAVisible(true);
    setModalBVisible(false);
    window.history.pushState({}, "", "/modal-a");
  };

  const openModalB = () => {
    setModalBVisible(true);
    setModalAVisible(false);
    window.history.pushState({}, "", "/modal-b");
  };

  const closeModal = () => {
    setModalAVisible(false);
    setModalBVisible(false);
    setModalCVisible(false);
    window.history.pushState({}, "", "/problem-2");
  };

  const loadMoreContacts = async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(
        `https://contact.mediusware.com/api/contacts/?page=${page + 1}`
      );
      const newData = response.data.results;
      setContacts([...contacts, ...newData]);
      setFilteredContacts([...filteredContacts, ...newData]);
      setPage(page + 1);
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error("Error fetching more contacts:", error);
    }
  };

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      loadMoreContacts();
    }
  };

  const handleSearchInputChangeModalA = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchTextModalA(searchText);

    const filtered = contacts.filter((contact) => {
      const formattedPhone = contact.phone.replace(/[^0-9]/g, "").toLowerCase();
      return (
        contact.country.name.toLowerCase().includes(searchText) ||
        formattedPhone.includes(searchText.replace(/[^0-9]/g, ""))
      );
    });
    setFilteredContacts(filtered);
  };

  const handleSearchInputChangeModalB = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchTextModalB(searchText);

    const filtered = contacts.filter((contact) => {
      const formattedPhone = contact.phone.replace(/[^0-9]/g, "").toLowerCase();
      return (
        contact.country.name.toLowerCase().includes(searchText) ||
        formattedPhone.includes(searchText.replace(/[^0-9]/g, ""))
      );
    });
    setFilteredContacts(filtered);
  };

  const handleSearchInputKeyDownModalA = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchInputChangeModalA(event);
    }
  };

  const handleSearchInputKeyDownModalB = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchInputChangeModalB(event);
    }
  };

  const closeModalC = () => {
    setModalCVisible(false);
  };

  const handleCheckboxChange = (event) => {
    setOnlyEvenID(event.target.checked);
    const filtered = contacts.filter((contact) =>
      event.target.checked ? contact.id % 2 === 0 : true
    );
    setFilteredContacts(filtered);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg"
            style={{ backgroundColor: "#46139f", color: "#fff" }}
            onClick={fetchAllContacts}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg"
            style={{ backgroundColor: "#ff7150", color: "#fff" }}
            onClick={fetchUSContacts}
          >
            US Contacts
          </button>
        </div>

        {/* Modal A */}
        <Modal
          show={modalAVisible}
          onHide={closeModal}
          onShow={() =>
            fetchContacts("https://contact.mediusware.com/api/contacts/?page=1")
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>All Contacts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="search">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTextModalA}
                  onChange={handleSearchInputChangeModalA}
                  onKeyDown={handleSearchInputKeyDownModalA}
                />
              </Form.Group>
              <Form.Group controlId="evenIDCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Only even IDs"
                  checked={onlyEvenID}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Form>
            <ul
              className="list-group"
              style={{ maxHeight: "300px", overflowY: "scroll" }}
              onScroll={handleScroll}
            >
              {filteredContacts.map((contact) => (
                <li
                  className="list-group-item"
                  key={contact.id}
                  onClick={() => openModalC(contact)}
                >
                  {contact.country.name} - {contact.phone}
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer>
              <Button
                variant="primary"
                style={{ backgroundColor: "#46139f", color: "#fff" }}
                onClick={openModalA}
              >
                All Contacts
              </Button>
              <Button
                variant="primary"
                style={{ backgroundColor: "#ff7150", color: "#fff" }}
                onClick={openModalB}
              >
                US Contacts
              </Button>
              <Button
                variant="secondary"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #46139f",
                  color: "#46139f",
                }}
                onClick={closeModal}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Footer>
        </Modal>

        {/* Modal B */}
        <Modal
          show={modalBVisible}
          onHide={closeModal}
          onShow={() =>
            fetchContacts(
              "https://contact.mediusware.com/api/country-contacts/United%20States/?page=1"
            )
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>US Contacts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="search">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTextModalB}
                  onChange={handleSearchInputChangeModalB}
                  onKeyDown={handleSearchInputKeyDownModalB}
                />
              </Form.Group>
              <Form.Group controlId="evenIDCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Only even IDs"
                  checked={onlyEvenID}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Form>
            <ul
              className="list-group"
              style={{ maxHeight: "300px", overflowY: "scroll" }}
              onScroll={handleScroll}
            >
              {filteredContacts.map((contact) => (
                <li
                  className="list-group-item"
                  key={contact.id}
                  onClick={() => openModalC(contact)}
                >
                  {contact.country.name} - {contact.phone}
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer>
              <Button
                variant="primary"
                style={{ backgroundColor: "#46139f", color: "#fff" }}
                onClick={openModalA}
              >
                All Contacts
              </Button>
              <Button
                variant="primary"
                style={{ backgroundColor: "#ff7150", color: "#fff" }}
                onClick={openModalB}
              >
                US Contacts
              </Button>
              <Button
                variant="secondary"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #46139f",
                  color: "#46139f",
                }}
                onClick={closeModal}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Footer>
        </Modal>

        {/* Modal C */}
        <Modal show={modalCVisible} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Contact Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedContact && (
              <div>
                <p>ID: {selectedContact.id}</p>
                <p>Phone: {selectedContact.phone}</p>
                <p>Country: {selectedContact.country.name}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModalC}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Problem2;
