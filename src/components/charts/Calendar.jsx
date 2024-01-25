import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
export default function Calendar(props) {
  const options = props.options;

  const setValue = props.setValue;
  const value = props.value;

  const [inputValue, setInputValue] = useState("");
  if (value == null && options.length > 0) {
    setValue(options[0]);
  }

  if (options.length === 0) {
    return (
      <div>
        <p>loading</p>
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id={props.label}
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label={props.label} />
          )}
        />
      </div>
    );
  }
}
