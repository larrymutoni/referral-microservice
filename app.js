const express = require("express");
const app = express();

const cors = require("cors");
const referralRoutes = require("./routes/referralRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

app.use(
  cors({
    origin: "*", // ← allows requests from anywhere
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Referral Microservice API",
      version: "1.0.0",
      description: "API documentation for the Referral Microservice",
    },
    servers: [
      {
        url: "https://referral-microservice.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use("/api/referrals", referralRoutes);

app.get("/", (req, res) => {
  res.send(
    
    "🎉 Referral Microservice is running! Visit /api-docs for Swagger UI."
  
  );
});

module.exports = app;
