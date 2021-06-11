import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "~/modules/Auth/_redux/authRedux";
// import {customersSlice} from "~/modules/ECommerce/_redux/customers/customersSlice";
// import {productsSlice} from "~/modules/ECommerce/_redux/products/productsSlice";
// import {remarksSlice} from "~/modules/ECommerce/_redux/remarks/remarksSlice";
// import {specificationsSlice} from "~/modules/ECommerce/_redux/specifications/specificationsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  products: productsSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
