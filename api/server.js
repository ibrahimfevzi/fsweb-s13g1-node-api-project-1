// SUNUCUYU BU DOSYAYA KURUN

const express = require("express");
const Users = require("./users/model");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  //get metodu "/" route => root
  res.send("İbrahim -root route");
});

// POST /api/users
server.post("/api/users", (req, res) => {
  let user = req.body;
  if (!user.name || !user.bio) {
    return res
      .status(400)
      .json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
  } else {
    Users.insert(user)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
      });
  }
});

// GET /api/users
server.get("/api/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
    });
});

//GET /api/users/:id
server.get("/api/users/:id", (req, res) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
    });
});

// DELETE /api/users/:id
server.delete("/api/users/:id", async (req, res) => {
  try {
    let willBeDeleteUser = await Users.findById(req.params.id);
    if (!willBeDeleteUser) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    } else {
      await Users.remove(req.params.id);
      res.status(200).json(willBeDeleteUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi" });
  }
});

// PUT /api/users/:id
server.put("/api/users/:id", async (req, res) => {
  try {
    let willBeUpdateUser = await Users.findById(req.params.id);
    if (!willBeUpdateUser) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    } else {
      if (!req.body.name || !req.body.bio) {
        res
          .status(400)
          .json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
      } else {
        let updateUser = await Users.update(req.params.id, req.body);
        res.status(200).json(updateUser);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
  }
});
module.exports = server; // SERVERINIZI EXPORT EDİN {}
