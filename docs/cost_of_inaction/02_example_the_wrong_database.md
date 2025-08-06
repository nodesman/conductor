# Example: The Wrong Database

## The Scenario

A developer starts a new project for a social media analytics platform. They tell the AI, "Let's build the backend for our new app. It needs to handle user profiles, posts, and relationships between users."

The developer has a clear mental model of a system with complex joins and transactions (e.g., ensuring that when a user is deleted, all their posts and comments are deleted in a single, atomic operation). This is a classic use case for a **relational database (like PostgreSQL or MySQL)**.

However, without this explicit context, the AI sees "social media" and "posts" and makes an assumption. It chooses **MongoDB**, a NoSQL database, because it's often used for flexible, schema-less data structures common in social media applications.

## The Cost

1.  **Initial Acceleration, Eventual Dead End:** The AI rapidly scaffolds models and API endpoints using Mongoose (a MongoDB library). The developer is initially impressed with the speed. However, when they try to implement features requiring complex queries (e.g., "show me all users who liked a post by a user I follow"), they hit a wall. These relational queries are difficult and inefficient in MongoDB.

2.  **The Painful Refactor:** The developer now faces a choice:
    *   **A) Fight the Tool:** Spend days writing complex, inefficient aggregation pipelines in MongoDB to simulate relational joins. The codebase becomes convoluted and slow.
    *   **B) Start Over:** Throw away all the database and model code and restart with a relational database like PostgreSQL.

3.  **Wasted Time and Effort:** The developer loses several days of work. The initial velocity provided by the AI was an illusion that led them down the wrong architectural path.

4.  **Loss of Confidence:** The developer's trust in the AI as a reliable partner is eroded. They now know they have to meticulously specify every single architectural choice, increasing their cognitive load for all future interactions.

## How the Scaffolder Helps

The Gemini Scaffolder would have asked a question like: *"What is the desired technology stack? (e.g., Frontend: React, Backend: Node.js, **DB: PostgreSQL**)"*.

By forcing this decision upfront, the developer would have specified "PostgreSQL," and the AI would have built the correct foundation from the start, saving days of wasted effort and frustration.
