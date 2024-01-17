const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const endpointData = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404: responds with error message when invalid path is passed", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((response) => {
        //console.log(response, "res");
        expect(response.body.message).toBe("Invalid path");
      });
  });
});

describe("GET /api", () => {
  test("GET:200 responds with an object describing all available endpoint on this API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointData);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 responds with an article object containing the right properties", () => {
    const testArticle = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: new Date(1604394720000).toISOString(),
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      votes: 0,
    };

    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(3);
        expect(body.article).toMatchObject(testArticle);
      });
  });
  test("GET:404 sends the correct status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("GET: 400 sends the correct status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 returns an array of article object each containing correct properties ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });

        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");

          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 responds with an array of all comments for a given article. the comment objects contain correct properties ", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });

        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET: 404 sends the correct status and error message message when given a valid but non-existend article_id", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("GET: 400 sends the correct status and error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("GET: 200 responds with an empty array when the given article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  describe("POST", () => {
    test("POST: 201 inserts a new comment for the given article and returns it as a response to the client", () => {
      const newComment = {
        username: "lurker",
        body: "I don't know about you, but I am a fan of lurking.",
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            author: "lurker",
            body: "I don't know about you, but I am a fan of lurking.",
            comment_id: 19,
            article_id: 2,
            votes: 0,
          });
        });
    });
    test("POST: 400 sends a correct status and error message when provided with a bad comment (missing required properties)", () => {
      const badComment = {
        username: "lurker",
      };

      return request(app)
        .post("/api/articles/3/comments")
        .send(badComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
    test("POST: 400 sends a correct status and error message when provided with a username that does not exist", () => {
      const badComment = {
        username: "iDontExist",
        body: "No comment",
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(badComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
    test("POST: 404 sends a correct status and error message when given a valid but non-existent article_id", () => {
      const newComment = {
        username: "lurker",
        body: "I don't know about you, but I am a fan of lurking.",
      };

      return request(app)
        .post("/api/articles/102/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
    test("POST: 400 sends a correct status and error message when given an invalid article_id", () => {
      const newComment = {
        username: "lurker",
        body: "I don't know about you, but I am a fan of lurking.",
      };

      return request(app)
        .post("/api/articles/not-an-article_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });
});

describe("PATCH api/articles/:article_id", () => {
  test("PATCH: 200 updates an article with given article_id and responds with an updated article to the client (increments votes if positive number)", () => {
    const changeVotesBy = {
      inc_votes: 5,
    };

    const updatedArticle = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      votes: 5,
    };

    return request(app)
      .patch("/api/articles/3")
      .send(changeVotesBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(updatedArticle);
      });
  });
  test("PATCH: 200 updates an article with given article_id and responds with an updated article to the client (decrements votes if negative number)", () => {
    const changeVotesBy = {
      inc_votes: -20,
    };

    const updatedArticle = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      votes: 80,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(changeVotesBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(updatedArticle);
      });
  });
  test("PATCH: 400 sends a correct status and error message when user sends an invalid inc_votes property", () => {
    const badChangeVotesBy = {
      inc_votes: "banana",
    };

    return request(app)
      .patch("/api/articles/5")
      .send(badChangeVotesBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("PATCH: 404 sends a correct status and error message given a valid but non-existent article_id", () => {
    const changeVotesBy = {
      inc_votes: 13,
    };

    return request(app)
      .patch("/api/articles/777")
      .send(changeVotesBy)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("PATCH: 400 sends a correct status and error message given an invalid article_id", () => {
    const changeVotesBy = {
      inc_votes: 11,
    };

    return request(app)
      .patch("/api/articles/not-an-article_id")
      .send(changeVotesBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204 deletes a comment of a given comment_id and responds with no content", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });
  test("DELETE 404 sends a correct status and error message given a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/7899")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment does not exist");
      });
  });
  test("DELETE 400 sends a correct status and error message given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 responds with an array of user objects containing the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/articles?topic=", () => {
  test("GET: 200 responds with an array of all article objects matching the topic in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");

          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");

          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

//valid empty response - 200 - if topic is not used in any article
//error handling topic query
//if topic doesn't exist
