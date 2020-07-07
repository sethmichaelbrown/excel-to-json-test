import React, { PureComponent } from "react";
import "./App.css";
import XLSX from "xlsx";
import moment from "moment";

class App extends PureComponent {
  state = {
    qbData: null,
    amdData: null,
    amdDate: null,
    qbDate: null,
  };

  compareSheets = () => {
    const sheet1Data =
      this.state.qbData?.find((i) => (i.sheet = "Sheet1"))?.data || [];
  };

  readFile = ({ target }) => {
    const uploadedFile = target.files[0];
    const isAMD = uploadedFile.name.includes("AdvancedMD");

    const date = moment(uploadedFile.name.match(/\d+/)[0]);

    if (this.state.amdDate || this.state.qbDate) {
      const storedDate = this.state.amdDate || this.state.qbDate;
      if (date.format("MM-YYYY") !== storedDate.format("MM-YYYY")) {
        return alert("Different dates detected, please check uploaded sheets");
      }
    }

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const workbook = XLSX.read(target.result, { type: "binary" });

      const jsonData = workbook.SheetNames.map((sheet) => {
        const obj = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );

        return {
          sheet,
          data: obj,
        };
      });

      if (isAMD) {
        this.setState({
          amdData: jsonData,
          amdDate: date,
        });
      } else {
        this.setState({
          qbData: jsonData,
          qbDate: date,
        });
      }
    };

    reader.readAsBinaryString(uploadedFile);
  };

  render() {
    return (
      <div className="App">
        <div className="row">
          <div className="col-6">
            <h6>QuickBooks Uploader</h6>
            <input
              type="file"
              id="qb"
              name="qb-file-uploader"
              accept=".xls, .xlsx"
              onChange={this.readFile}
            />
          </div>

          <div className="col-6">
            <h6>AdvancedMD Uploader</h6>
            <input
              type="file"
              id="amd"
              name="amd-file-uploader"
              accept=".xls, .xlsx"
              onChange={this.readFile}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button onClick={this.compareSheets}>Print Datasets</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
