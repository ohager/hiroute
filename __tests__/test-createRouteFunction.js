import createRouteFunction from '../modules/createRouteFunction';

function routingImpl(url){
	return url;
}

describe("create Route functions", () => {

	it("for empty path", () => {
		const path = "/";
		const result = createRouteFunction(routingImpl, path);

		expect(result.goToIndex).toBeDefined();
		expect(result.goToIndex()).toBe("/");
	});

	it("without variables", () => {
		const path = "/test";
		const result = createRouteFunction(routingImpl, path);

		expect(result.goToTest).toBeDefined();
		expect(result.goToTest()).toBe("/test");
	});


	it("with uri variable", () => {
		let path = "/test/:id";
		let result = createRouteFunction(routingImpl, path);

		expect(result.goToTest).toBeDefined();
		expect(result.goToTest({id: 100})).toBe("/test/100");

		path = "/test/:id/details";
		result = createRouteFunction(routingImpl, path);

		expect(result.goToTestDetails).toBeDefined();
		expect(result.goToTestDetails({id: 100})).toBe("/test/100/details");
	});

	it("with multiple uri variables", () => {
		const path = "/order/:id/product/:productId/details";
		const result = createRouteFunction(routingImpl, path);

		expect(result.goToOrderProductDetails).toBeDefined();
		expect(result.goToOrderProductDetails({id: 1, productId: "deadbeef"})).toBe("/order/1/product/deadbeef/details");
	});

	it("with alias", () => {
		const path = "/order/:id";
		const result = createRouteFunction(routingImpl, path, "Bestellung" );

		expect(result.goToBestellung).toBeDefined();
		expect(result.goToBestellung({id: 1})).toBe("/order/1");
	});

	it("with options #1 (prefix)", () => {
		const path = "/order/:id";
		const opts = {
			prefix: "geheZu"
		};
		const result = createRouteFunction(routingImpl, path, null, opts );

		expect(result.geheZuOrder).toBeDefined();
		expect(result.geheZuOrder({id: 1})).toBe("/order/1");
	});

	it("with options #2 (defaultPath)", () => {
		const opts = {
			defaultPath : "Home"
		};
		const result = createRouteFunction(routingImpl, "/", null, opts );

		expect(result.goToHome).toBeDefined();
		expect(result.goToHome()).toBe("/");
	});

	it("handles optional variables (:foo)", () => {
		const result = createRouteFunction(routingImpl, "/test/(:id)");

		expect(result.goToTest).toBeDefined();
		expect(result.goToTest()).toBe("/test");
		expect(result.goToTest({id: 1})).toBe("/test/1");
	});

	it("ignores path with *", () => {
		const result = createRouteFunction(routingImpl, "/test/*.jpg" );
		expect(result).toBeNull();
	});

});
