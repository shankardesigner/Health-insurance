const { createAction } = require("@reduxjs/toolkit");

const sliceName = "stopLoss";

const getStopLossDetails = createAction(`${sliceName}/getDetails`);

const listSuccess = createAction(
  `${sliceName}/listSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const addAggregate = createAction(
  `${sliceName}/addAggregate`,
  function prepare(payload) {
    return { payload };
  }
);

export { getStopLossDetails, listSuccess };
