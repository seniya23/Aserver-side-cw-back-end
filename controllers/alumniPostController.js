import alumniPostTable from "../models/alumniPostTable.js";
import userTable from "../models/userTable.js";

export function createAlumniPost(req, res) {
    if (!req.user) {
        res.status(401).json({
            message: "Please login"
        });
        return;
    }

    if (req.user.role !== "alumni") {
        res.status(403).json({
            message: "Only alumni can create posts"
        });
        return;
    }

    const content = req.body.content;

    if (!content || typeof content !== "string" || content.trim() === "") {
        res.status(400).json({
            message: "Post content is required"
        });
        return;
    }

    alumniPostTable.run(
        "INSERT INTO alumni_posts (alumniEmail, content) VALUES (?, ?)",
        [req.user.email, content.trim()],
        function (err) {
            if (err) {
                res.status(500).json({
                    message: "Failed to create post"
                });
                return;
            }

            res.status(201).json({
                message: "Post created successfully",
                postId: this.lastID
            });
        }
    );
}

export function getHomeFeedPosts(req, res) {
    if (!req.user) {
        res.status(401).json({
            message: "Please login"
        });
        return;
    }

    alumniPostTable.all(
        `SELECT 
            p.id,
            p.content,
            p.createdAt,
            u.email AS alumniEmail,
            u.firstName,
            u.lastName,
            u.image
         FROM alumni_posts p
         INNER JOIN users u ON p.alumniEmail = u.email
         ORDER BY p.createdAt DESC`,
        [],
        (err, posts) => {
            if (err) {
                res.status(500).json({
                    message: "Failed to fetch posts"
                });
                return;
            }

            res.json({
                message: posts
            });
        }
    );
}

export function getPostsByAlumniEmail(req, res) {
    const email = req.params.email;

    userTable.get(
        "SELECT email, firstName, lastName, image FROM users WHERE email = ?",
        [email],
        (userErr, alumni) => {
            if (userErr) {
                res.status(500).json({
                    message: "Database error"
                });
                return;
            }

            if (!alumni) {
                res.status(404).json({
                    message: "Alumni not found"
                });
                return;
            }

            alumniPostTable.all(
                `SELECT id, content, createdAt
                 FROM alumni_posts
                 WHERE alumniEmail = ?
                 ORDER BY createdAt DESC`,
                [email],
                (postErr, posts) => {
                    if (postErr) {
                        res.status(500).json({
                            message: "Failed to fetch alumni posts"
                        });
                        return;
                    }

                    res.json({
                        alumni,
                        posts
                    });
                }
            );
        }
    );
}
