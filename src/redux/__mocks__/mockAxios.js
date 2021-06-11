import MockAdapter from "axios-mock-adapter";
import mockAuth from "~/modules/Auth/__mocks__/mockAuth";
import mockCustomers from "~/modules/ECommerce/__mocks__/mockCustomer";
import mockProducts from "~/modules/ECommerce/__mocks__/mockProduct";
import mockRemarks from "~/modules/ECommerce/__mocks__/mockRemark";
import mockSpecifications from "~/modules/ECommerce/__mocks__/mockSpecification";

export default function mockAxios(axios) {
  const mock = new MockAdapter(axios, { delayResponse: 300 });

  mockAuth(mock);
  mockCustomers(mock);
  mockProducts(mock);
  mockRemarks(mock);
  mockSpecifications(mock);

  return mock;
}
