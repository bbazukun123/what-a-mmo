// import the library before creating your pixi application to ensure all mixins are applied
import "@pixi/layout";
// import { connect } from "./spacetimeDb";
import { Application } from "./app/Application";

// Create a new application.
const app = new Application();
void app.run();

// connect();
