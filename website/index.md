---
layout: default
---

<div class="container">

  <!-- Hero Section -->
  <section class="hero">
    <h1 class="hero-title">Stop Talking to Your AI.<br>Start Conducting It.</h1>
    <p class="hero-subtitle">`conductor` is a command-line tool that transforms your interaction with AI from a simple chat into a structured, repeatable engineering discipline.</p>
    <div class="hero-buttons">
      <a href="#install" class="btn btn-primary">Install via npm</a>
      <a href="{{ site.github_repo_url }}" class="btn btn-secondary" target="_blank">View on GitHub</a>
    </div>
  </section>

  <!-- The Problem -->
  <section id="problem" class="section">
    <h2 class="section-title">The Chaos of Context-Free AI</h2>
    <p>Naively using Large Language Models for software development leads to hasty, poorly-architected solutions that ignore your project's standards. The AI means well, but it lacks deep codebase context. The result? Code that needs to be rewritten.</p>
  </section>

  <!-- The Solution -->
  <section id="solution" class="section">
    <h2 class="section-title">AI-Guided Development on Rails</h2>
    <p>`conductor` provides a set of "mental jigs"—high-precision, reusable commands that generate the perfect prompt every time. It forces a thoughtful workflow of critiquing, planning, and providing deep context, ensuring the AI acts as a true thought partner.</p>
  </section>

  <!-- Features Section -->
  <section id="features" class="section">
    <h2 class="section-title">Core Commands</h2>
    <div class="features-grid">
      <div class="feature-card">
        <h3>conductor --critique</h3>
        <p>Challenge your own assumptions. Use the AI to find flaws in your reasoning *before* you write a single line of code.</p>
        <pre><code>conductor --critique "We should build a real-time notification system." | gemini</code></pre>
      </div>
      <div class="feature-card">
        <h3>conductor --plan</h3>
        <p>Force architectural thinking upfront. Generate a detailed, step-by-step implementation plan for any feature.</p>
        <pre><code>conductor --plan "Feature: Real-time notifications for comments" | gemini</code></pre>
      </div>
      <div class="feature-card">
        <h3>conductor --contextualize</h3>
        <p>Provide deep context. Feed the AI relevant files to ensure its output matches your project's existing patterns and conventions.</p>
        <pre><code>conductor --contextualize src/api.ts "Implement the API endpoint" | gemini</code></pre>
      </div>
      <div class="feature-card">
        <h3>conductor --refine</h3>
        <p>Iterate on quality. Have the AI review its own output for bugs, security flaws, and style violations.</p>
        <pre><code>conductor --refine &lt;path/to/generated_code.js&gt; | gemini</code></pre>
      </div>
    </div>
  </section>

  <!-- Install Section -->
  <section id="install" class="section">
    <h2 class="section-title">Get Started</h2>
    <p>Install `conductor` from npm and start having more productive conversations with your AI today.</p>
    <pre><code>npm install -g conductor-ai
</code></pre>
  </section>

</div>