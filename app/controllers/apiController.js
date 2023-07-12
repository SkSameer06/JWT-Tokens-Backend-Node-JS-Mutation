/** @format */

var express = require("express");
const apiModal = require("../models/apiModal");
const jwt = require("jsonwebtoken");
// const cors = require('cors');

function generateToken(id, email, password) {
  const secret = "asdfSFS34wfsdfsdfSDSD32dfsddDDerQSNCK34SOWEK5354fdgdf4";

  const payload = {
    id: id,
    email: email,
    password: password,
  };

  const options = {
    expiresIn: "1m", // Token expiration time
  };

  const token = jwt.sign(payload, secret, options);
  // console.log("JWT Token:", token);

  return token;
}

function generateRefreshToken(id, email, password) {
  const secret = "asdfSFS34wfsdfsdfSDSD32dfsddDDerQSNCK34SOWEK5354fdgdf4";
  const expiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days expiration

  const payload = {
    id: id,
    email: email,
    password: password,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "30d" });
  // console.log("Refresh Token:", token);

  return token;
}

function parseJwt(jwtString) {
  const token = jwtString.trim();
  const secret = "asdfSFS34wfsdfsdfSDSD32dfsddDDerQSNCK34SOWEK5354fdgdf4";

  try {
    const decoded = jwt.verify(token, secret);

    const expirationDateTime = new Date(decoded.exp * 1000);
    const currentDateTime = new Date();

    // console.log("Expiration Time: ", expirationDateTime);
    // console.log("Current Time: ", currentDateTime);

    if (currentDateTime > expirationDateTime) {
      // console.log("JWT token has expired");
    } else {
      // console.log("JWT token is still valid");
    }

    return decoded;
  } catch (error) {
    console.log("Error parsing JWT: ", error.message);
    return null;
  }
}

function validateRefreshToken(refreshToken) {
  const secret = "asdfSFS34wfsdfsdfSDSD32dfsddDDerQSNCK34SOWEK5354fdgdf4";

  try {
    const decoded = jwt.verify(refreshToken, secret);
    return decoded;
  } catch (error) {
    // Handle token verification failure
    throw new Error("Invalid refresh token");
  }
}

module.exports = {
  movieLists: function (req, res) {
    var movies = [
      { id: 101, name: "Fight Club", year: 1999, rating: 8.1 },
      { id: 102, name: "Inception", year: 2010, rating: 8.7 },
      { id: 103, name: "The Dark Knight", year: 2008, rating: 9 },
      { id: 104, name: "12 Angry Men", year: 1957, rating: 8.9 },
    ];
    console.log("Movies::::>", movies);
    res.json(movies);
    // res.render('index', { movie: 'Express' });
  },

  signUp: function (req, res) {
    console.log(req.body.name);
    console.log(req.body.number);
    console.log(req.body.email);
    console.log(req.body.password);
    var result = apiModal.signup(
      req.body.name,
      req.body.number,
      req.body.email,
      req.body.password
    );

    console.log("RES:::::::::::>", result);

    if (result === 0) {
      res.json("Invalid Data");
    } else {
      res.json("Data Inserted");
    }

    // console.log(res.name);
    // console.log(req.json);
  },

  login: function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    // console.log(email);
    // console.log(password);

    if (
      email === null ||
      email === "" ||
      password === null ||
      password === ""
    ) {
      const map = new Map();
      map.set("IncorrectCredentials", 11);
      res.send(map);
    } else {
      apiModal
        .loginUser(req.body.email, req.body.password)
        .then((data) => {
          //    const myJSON = JSON.stringify(data);
          const dbEmail = data.map((obj) => obj.email).toString();
          const dbPassword = data.map((obj) => obj.password).toString();
          const dbIdd = data.map((obj) => obj.id);
          const dbId = parseInt(dbIdd);
          // console.log("Response:::::>", dbEmail.toString());
          // console.log("Response:::::>", dbPassword.toString());
          // console.log("Response:::::>", dbId);

          if (
            dbEmail === "" ||
            dbPassword === "" ||
            dbEmail === null ||
            dbPassword === null
          ) {
            const map = new Map();
            map.set("IncorrectCredentials", 11);
            const response = Object.fromEntries(map);
            res.json(response);
          } else {
            const token = generateToken(dbId, dbEmail, dbPassword);
            const refreshToken = generateRefreshToken(
              dbId,
              dbEmail,
              dbPassword
            );
            // console.log("Access Token:>", token);
            // console.log("Refresh Token:>", refreshToken);
            const obj = {
              AccessToken: token,
              RefreshToken: refreshToken,
            };
            res.json(obj);
          }
        })
        .catch((err) => {
          console.log("Error:::::>", err);
        });
    }
  },

  userData: function (req, res) {
    // console.log("User Data:::::::>");
    // res.json("User Data:::::::>");
    console.log("AccessTokenOfUserDAta:::>", req.headers.authorization);

    var bearerToken = req.headers.authorization;

    var token, token1;

    if (bearerToken != null) {
      if (bearerToken.includes("Bearer ")) {
        token = bearerToken.replace("Bearer ", "");
      } else {
        token1 = "Bearer " + bearerToken;
        token = token1.replace("Bearer ", "");
      }

      try {
        const decodedToken = parseJwt(token);
        console.log("Token:::::>", decodedToken);
        console.log("Token:::::>", decodedToken.email);
        console.log("Token:::::>", decodedToken.password);

        if (decodedToken === null) {
          res.json("Token is Invalid");
        } else {
          apiModal
            .userById(decodedToken.id)
            .then((data) => {
              console.log("Data::::::>", data);
              res.json(JSON.stringify(data));
            })
            .catch((err) => {
              console.log("Erorr:::::::>", err);
            });
        }
      } catch (error) {
        res.json("Token is Invalid");
      }
    }
  },

  refreshtoken: function (req, res) {
    console.log("RefreshToken:::>", req.headers.refresh);
    try {
      const decoded = validateRefreshToken(req.headers.refresh);

      console.log("Decoded Refresh Token:::::::>", decoded);

      if (decoded === null) {
        res.send("Token is Invalid");
      } else {
        const token = generateToken(
          decoded.id,
          decoded.email,
          decoded.password
        );
        res.send(token);
      }
    } catch (error) {
      res.send("Token is Invalid");
    }
  },

  validateAccessToken: function (req, res) {
    // console.log("Validate Access Token:::::::>");
    // res.json("Validate Access Token:::::::>");
        // console.log("Inside Valide Access Token:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::>");
        // res.json("Sameer");
    console.log("Inside Validate");
    console.log("AccessTokenValidate:::>", req.headers.authorization);
    console.log("RefreshTokenValidate:::>", req.headers.refresh);

    const bearerToken = req.headers.authorization;

    var token, token1;

    if (bearerToken != null) {
      if (bearerToken.includes("Bearer ")) {
        token = bearerToken.replace("Bearer ", "");
      } else {
        token1 = "Bearer " + bearerToken;
        token = token1.replace("Bearer ", "");
      }

      try {
        const decodedToken = parseJwt(token);
        console.log("Decode Token:::::::::>" + decodedToken);

        if (decodedToken === null) {
          const decoded = validateRefreshToken(req.headers.refresh);

          if (decoded != null) {
            const token = generateToken(
              decoded.id,
              decoded.email,
              decoded.password
            );

            res.json(token);
          } else {
            res.json("Sameer");
          }
        }

        res.json("Sameer");
      } catch (error) {
        console.log("Exception::::::::::::::::::::::::::::::>");
        console.error();

        const decoded = validateRefreshToken(req.headers.refresh);

        if (decoded != null) {
          const token = generateToken(
            decoded.id,
            decoded.email,
            decoded.password
          );
          res.json(token);
        } else {
          res.json("Sameer");
        }
      }
    }
   },
};
