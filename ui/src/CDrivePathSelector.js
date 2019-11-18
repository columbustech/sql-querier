import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Modal, Button } from 'react-bootstrap';

class CDrivePathSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driveObjects: [],
      selectedPath: []
    };
  }
  getDriveObjects(path) {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('pquery_token');
    const request = axios({
      method: 'GET',
      url: window.location.protocol + "//api." + window.location.hostname + "/list/?path=" + path,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        dobjs = this.state.driveObjects;
        for (var path of paths) {

        }
      },
    );

  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CDrivePathSelector;
