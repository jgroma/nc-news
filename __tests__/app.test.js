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
        expect(body.articles.length).toBeGreaterThan(0);
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
  test("GET: 200 responds with an empty array given a topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("GET: 404 responds with a correct status and error message if topic query does not exist in the database", () => {
    return request(app)
      .get("/api/articles?topic=not-a-topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic does not exist");
      });
  });
});

describe("/api/articles/:article_id(comment_count)", () => {
  test("GET: 200 responds with an article object of given article_id that has a comment_count property", () => {
    const testArticle = {
      title: "UNCOVERED: catspiracy to bring down democracy",
      topic: "cats",
      author: "rogersop",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(2);
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.comment_count).toBe("number");
        expect(body.article).toMatchObject(testArticle);
      });
  });
});

describe("/api/articles (sorting queries)", () => {
  test("GET: 200 responds with an array of article objects sorted by created_at property by default if no sort_by query included", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        expect(body.articles.length).toBeGreaterThan(0);
      });
  });
  test("GET: 200 responds with an array of article objects sorted by the property given in sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
        expect(body.articles.length).toBeGreaterThan(0);
      });
  });
  test("GET: 400 sends a correct status and error message if given invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_sort_query")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid sort_by query");
      });
  });
  test("GET: 200 responds with an array of objects ordered in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("article_id", { descending: true });
        expect(body.articles.length).toBeGreaterThan(0);
      });
  });
  test("GET: 200 responds with an array of objects ordered in ascending order if given order query=asc", () => {
    return request(app)
      .get("/api/articles?order=asc&sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: false });
        expect(body.articles.length).toBeGreaterThan(0);
      });
  });
  test("GET: 400 sends a correct status and error message when given an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=not-an-order-query")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid order query");
      });
  });
});

describe("/api/users/:username", () => {
  test("GET: 200 responds with a user object of given username", () => {
    const testUser = {
      username: "butter_bridge",
      name: "jonny",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    };

    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(testUser);
        expect(typeof body.user.username).toBe("string");
        expect(typeof body.user.name).toBe("string");
        expect(typeof body.user.avatar_url).toBe("string");
      });
  });
  test("GET: 404 sends a correct status and error message when given a non-existent username", () => {
    return request(app)
      .get("/api/users/not-an-username")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username does not exist");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH: 200 updates a comment with given comment_id and responds with updated comment (increments votes if positive number)", () => {
    const changeVotesBy = {
      inc_votes: 2,
    };

    const updatedComment = {
      body: "I hate streaming noses",
      votes: 2,
      author: "icellusedkars",
      article_id: 1,
      created_at: expect.any(String),
    };

    return request(app)
      .patch("/api/comments/5")
      .send(changeVotesBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject(updatedComment);
      });
  });
  test("PATCH: 200 updates a comment with given comment_id and responds with updated comment (decrements votes if negative number)", () => {
    const changeVotesBy = {
      inc_votes: -3,
    };

    const updatedComment = {
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 13,
      author: "butter_bridge",
      article_id: 9,
      created_at: expect.any(String),
    };

    return request(app)
      .patch("/api/comments/1")
      .send(changeVotesBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject(updatedComment);
      });
  });
  test("PATCH: 400 sends a correct status and error message when given an invalid inc_votes property", () => {
    const changeVotesBy = {
      inc_votes: "not-a-number",
    };
    return request(app)
      .patch("/api/comments/2")
      .send(changeVotesBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("PATCH: 404 sends a correct status and error message when given a valid but non-existent comment_id", () => {
    const changeVotesBy = {
      inc_votes: -3,
    };

    return request(app)
      .patch("/api/comments/9999")
      .send(changeVotesBy)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment does not exist");
      });
  });
  test("PATCH: 400 sends a correct status and error message when given an invalid comment_id", () => {
    const changeVotesBy = {
      inc_votes: -3,
    };

    return request(app)
      .patch("/api/comments/not-a-comment_id")
      .send(changeVotesBy)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("POST: 201 inserts a new article and returns it as a response to the client", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Love letter to pancakes",
      body: "Pancakes are the best breakfast food. Pancakes are my past, present, future.",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject(newArticle);
        expect(typeof body.article.article_id).toBe("number");
        expect(typeof body.article.created_at).toBe("string");
        expect(body.article.votes).toBe(0);
        expect(body.article.comment_count).toBe(0);
      });
  });
  test("POST: 201 article_img_url will default if omitted", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Love letter to pancakes",
      body: "Pancakes are the best breakfast food. Pancakes are my past, present, future.",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject(newArticle);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(typeof body.article.article_id).toBe("number");
        expect(typeof body.article.created_at).toBe("string");
        expect(body.article.votes).toBe(0);
        expect(body.article.comment_count).toBe(0);
      });
  });
  test("POST: 400 sends a correct status and error message when provided with a bad article (missing properties)", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Love letter to pancakes",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("POST: 404 sends a correct status and error message when author does not exist in the database", () => {
    const newArticle = {
      author: "iDontExist",
      title: "Love letter to pancakes",
      body: "Pancakes are the best breakfast food. Pancakes are my past, present, future.",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User does not exist");
      });
  });
  test("POST: 404 sends a correct status and error message when topic does not exist in the database", () => {
    const newArticle = {
      author: "lurker",
      title: "Love letter to pancakes",
      body: "Pancakes are the best breakfast food. Pancakes are my past, present, future.",
      topic: "iDontExist",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic does not exist");
      });
  });
});

describe("/api/articles(pagination)", () => {
  test("GET: 200 responds with an array of 10 article objects when limit query not specified", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("GET: 200 responds with an array of article objects of limited by limit query and offset by p query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&limit=3&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
        expect(body.articles[0].article_id).toBe(10);
        expect(body.articles[1].article_id).toBe(9);
        expect(body.articles[2].article_id).toBe(8);
      });
  });
  test("GET: 200 responds with total_count property that displays the total number of articles discounting the the limit", () => {
    return request(app)
      .get("/api/articles?topic=mitch&limit=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(12);
      });
  });
  test("GET: 400 sends a correct status and error message when limit query is invalid", () => {
    return request(app)
      .get("/api/articles?limit=not-a-limit")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid limit query");
      });
  });
  test("GET: 400 sends a correct status and error message when p query is invalid", () => {
    return request(app)
      .get("/api/articles?p=not-a-page")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid p query");
      });
  });
});

describe("/api/articles/:article_id/comments (pagination)", () => {
  test("GET: 200 responds with an array of comments for a given article_id,array size defaults to 10 when given no limit query", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
      });
  });
  test("GET: 200 responds with an array of comments limited by limit query and offset by p query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        expect(body.comments[0].comment_id).toBe(13);
        expect(body.comments[1].comment_id).toBe(7);
        expect(body.comments[2].comment_id).toBe(8);
      });
  });
  test("GET: 400 sends a correct status and error message when limit query is invalid", () => {
    return request(app)
      .get("/api/articles?limit=not-a-limit")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid limit query");
      });
  });
  test("GET: 400 sends a correct status and error message when p query is invalid", () => {
    return request(app)
      .get("/api/articles?p=not-a-page")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid p query");
      });
  });
});
