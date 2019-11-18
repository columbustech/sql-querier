import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './UploadFile.css';

class UploadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToQueryPage: false,
            isLoading: false,
            tableName: '',
            dataPath: '',
            schemaPath: '',
            showDataPathSelector: false,
            showSchemaPathSelector: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleDataPathSelector = this.toggleDataPathSelector.bind(this);
        this.toggleSchemaPathSelector = this.toggleSchemaPathSelector.bind(this);
        this.setDataPath = this.setDataPath.bind(this);
        this.setSchemaPath = this.setSchemaPath.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        
        this.setState({
            isLoading: true,
        });

        const data = new FormData();
        data.append('table_name', this.state.tableName);

        const cookies = new Cookies();

        data.append('data_path', this.state.dataPath);
        data.append('schema_path', this.state.schemaPath);
        data.append('access_token', cookies.get('pquery_token'));
        const request = axios({
          method: 'POST',
          url: window.location.protocol + "//" + window.location.hostname + window.location.pathname + "api/upload/",
          data: data
        });

        request.then(
          response => {
            this.setState({
                redirectToQueryPage: true,
            });
          },
        );
    }
    handleChange(e) {
      this.setState({tableName: e.target.value});
    }
    toggleDataPathSelector() {
      this.setState({showDataPathSelector: !this.state.showDataPathSelector});
    }
    toggleSchemaPathSelector() {
      this.setState({showSchemaPathSelector: !this.state.showSchemaPathSelector});
    }
    setDataPath(path) {
      this.setState({dataPath: path});
    }
    setSchemaPath(path) {
      this.setState({schemaPath: path});
    }
    render() {
        if (this.state.redirectToQueryPage) {
            return <Redirect to='/query'/>;
        }
        let createButton;
        if(this.state.isLoading) {
            createButton = <button className="btn btn-lg btn-primary btn-block" type="submit" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>;
        } else {
            createButton = <button className="btn btn-lg btn-primary btn-block" type="submit">Create Table</button>;
        }
        return(
            <div className="upload-container">
                <form className="form-upload" onSubmit={this.handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">Upload a Table</h1>
                    <input type="text" className="form-control" placeholder="Enter Table Name" 
                        value={this.state.tableName} onChange={this.handleChange} required autoFocus>
                    </input>
                    <br />

                    <button className="btn btn-secondary" onClick={this.toggleDataPathSelector}>
                      Choose Folder to Query
                    </button>}

                    <br />
                    <input type="text" className="form-control" placeholder="Enter CDrive Path to Schema File" 
                        value={this.state.schemaPath} onChange={this.handleSchemaPathChange} required>
                    </input>
                    <br />
                    {createButton}
                </form>
                <CDrivePathSelector show={this.state.showDataPathSelector} 
                  toggleModal={this.toggleDataPathSelector} setPath={this.setDataPath}/>
                <CDrivePathSelector show={this.state.showSchemaPathSelector} 
                  toggleModal={this.toggleDataPathSelector} setPath={this.setSchemaPath}/>
            </div>
        );
    }
}

export default UploadFile;
