import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect, useReducer } from "react";
import http from "common/utils/httpClient";
import { Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { Title } from "react-admin";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { encounterTypeInitialState } from "../Constant";
import { encounterTypeReducer } from "../Reducers";

const EncounterTypeEdit = props => {
  const [encounterType, dispatch] = useReducer(encounterTypeReducer, encounterTypeInitialState);
  const [nameValidation, setNameValidation] = useState(false);
  const [error, setError] = useState("");
  const [redirectShow, setRedirectShow] = useState(false);
  const [encounterTypeData, setEncounterTypeData] = useState({});
  const [deleteAlert, setDeleteAlert] = useState(false);

  useEffect(() => {
    http
      .get("/web/encounterType/" + props.match.params.id)
      .then(response => response.data)
      .then(result => {
        setEncounterTypeData(result);
        dispatch({ type: "setData", payload: result });
      });
  }, []);

  const onSubmit = () => {
    if (encounterType.name.trim() === "") {
      setError("");
      setNameValidation(true);
    } else {
      setNameValidation(false);
      http
        .put("/web/encounterType/" + props.match.params.id, {
          name: encounterType.name,
          encounterEligibilityCheckRule: encounterType.encounterEligibilityCheckRule,
          id: props.match.params.id,
          organisationId: encounterTypeData.organisationId,
          encounterTypeOrganisationId: encounterTypeData.encounterTypeOrganisationId,
          voided: encounterTypeData.voided
        })
        .then(response => {
          if (response.status === 200) {
            setError("");
            setRedirectShow(true);
          }
        })
        .catch(error => {
          setError(error.response.data.message);
        });
    }
  };

  const onDelete = () => {
    http
      .delete("/web/encounterType/" + props.match.params.id)
      .then(response => {
        if (response.status === 200) {
          setDeleteAlert(true);
        }
      })
      .catch(error => {});
  };

  return (
    <>
      <Box boxShadow={2} p={3} bgcolor="background.paper">
        <Title title={"Edit encounter type "} />
        <Grid container item={12} style={{ justifyContent: "flex-end" }}>
          <Button color="primary" type="button" onClick={() => setRedirectShow(true)}>
            <VisibilityIcon /> Show
          </Button>
        </Grid>
        <div className="container" style={{ float: "left" }}>
          <TextField
            id="name"
            label="Name"
            autoComplete="off"
            value={encounterType.name}
            onChange={event => dispatch({ type: "name", payload: event.target.value })}
          />
          <div />
          {nameValidation && (
            <FormLabel error style={{ marginTop: "10px", fontSize: "12px" }}>
              Empty name is not allowed.
            </FormLabel>
          )}
          {error !== "" && (
            <FormLabel error style={{ marginTop: "10px", fontSize: "12px" }}>
              {error}
            </FormLabel>
          )}

          <p />
          <FormLabel>Enrolment eligibility check rule</FormLabel>
          <Editor
            value={
              encounterType.encounterEligibilityCheckRule
                ? encounterType.encounterEligibilityCheckRule
                : ""
            }
            onValueChange={event =>
              dispatch({ type: "encounterEligibilityCheckRule", payload: event })
            }
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 15,
              height: "auto",
              borderStyle: "solid",
              borderWidth: "1px"
            }}
          />
          <p />
        </div>
        <Grid container item sm={12}>
          <Grid item sm={1}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => onSubmit()}
              style={{ marginLeft: "14px" }}
            >
              <i className="material-icons">save</i>Save
            </Button>
          </Grid>
          <Grid item sm={11}>
            <Button style={{ float: "right", color: "red" }} onClick={() => onDelete()}>
              <DeleteIcon /> Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
      {redirectShow && <Redirect to={`/appDesigner/encounterType/${props.match.params.id}/show`} />}
      {deleteAlert && <Redirect to="/appDesigner/encounterType" />}
    </>
  );
};

export default EncounterTypeEdit;
