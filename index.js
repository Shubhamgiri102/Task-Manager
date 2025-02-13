const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) {
            console.error(err);
            return res.render("index", { files: [] }); // Return empty array if error occurs
        }
        res.render("index", { files });
    });
});


app.get('/file/:filename', function (req, res) {
    const filePath = path.join(__dirname, "files", req.params.filename);  // Ensure correct file path

    fs.readFile(filePath, "utf-8", function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found!");
        }
        res.render("show", { content: data, filename: req.params.filename });
    });
});

// edit features  k liye
app.get('/edit/:filename', function (req, res) {
    res.render('edit',{filename:req.params.filename});
});

// post route for updating 
app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err,){
        res.redirect('/');
    })
});



app.post('/create', function (req, res) {
    const { title, details } = req.body; // Extract data from the form

    if (!title || !details) {
        return res.status(400).send("Title or Details missing!"); // Validate input
    }

    const fileName = title.replace(/\s+/g, '_') + ".txt"; // Sanitize filename

    fs.writeFile(`./files/${fileName}`, details, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error saving file");
        }
        res.redirect("/"); // Redirect to home page after saving
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
