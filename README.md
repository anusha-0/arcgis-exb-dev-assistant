# arcgis-exb-dev-assistant

# AI Developer Assistant for ArcGIS Experience Builder

An AI-powered developer assistant embedded directly inside ArcGIS Experience Builder that can generate custom widget code, understand the Jimu framework, and write files directly into your project.

## Overview

Building custom widgets in ArcGIS Experience Builder often requires navigating complex Jimu APIs, TypeScript configurations, and framework-specific patterns. This project demonstrates how to integrate an AI assistant directly into Experience Builder, allowing developers to describe a widget in natural language and have the AI generate the necessary code automatically.

The solution combines:

* A custom MCP (Model Context Protocol) server
* An embedded Developer Assistant chatbot widget
* A file server for secure project file operations
* Claude AI integration for code generation

The result is a workflow where developers can create widgets using prompts instead of manually writing boilerplate code.

## Architecture

```text
+-------------------------+
| ArcGIS Experience Builder |
+------------+------------+
             |
             v
+-------------------------+
| Developer Assistant UI  |
| (Custom ExB Widget)     |
+------------+------------+
             |
             v
+-------------------------+
| Claude AI + MCP Server  |
+------------+------------+
             |
             v
+-------------------------+
| Local File Server       |
+------------+------------+
             |
             v
+-------------------------+
| Experience Builder      |
| Widget Files            |
+-------------------------+
```

## Features

* AI-powered widget generation
* ArcGIS Experience Builder 1.20 support
* Jimu framework-aware code generation
* TypeScript support
* Direct project file creation and updates
* Embedded chatbot interface
* MCP-based architecture
* Developer productivity enhancement

## Project Structure

```text
project-root/
│
├── src/
│   ├── runtime/
│   ├── setting/
│   └── components/
│
├── dist/
│
├── file-server.mjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

## How It Works

### 1. MCP Server

The MCP server provides Claude AI with framework-specific knowledge about:

* ArcGIS Experience Builder
* Jimu Core APIs
* Widget development patterns
* Configuration structures
* TypeScript implementation details

### 2. Developer Assistant Widget

A custom Experience Builder widget that:

* Accepts natural language prompts
* Communicates with the MCP server
* Displays AI-generated responses
* Initiates code generation workflows

### 3. File Server

The file server acts as a bridge between the browser environment and the local project filesystem, enabling generated code to be written directly into widget folders.

## Example Prompt

```text
Create a widget that displays selected feature attributes
from the active map layer in a responsive card layout.
```

The assistant can generate:

* Widget component code
* Settings panel code
* Configuration files
* TypeScript interfaces
* Supporting styles

## Getting Started

### Prerequisites

* Node.js
* ArcGIS Experience Builder Developer Edition
* Claude API access
* MCP SDK

### Install Dependencies

```bash
npm install
```

### Start the File Server

```bash
node file-server.mjs
```

### Run Experience Builder

Start your Experience Builder development environment and add the Developer Assistant widget to your application.

## Use Cases

* Rapid widget prototyping
* Learning Experience Builder development
* Generating boilerplate code
* Accelerating custom widget creation
* Exploring Jimu APIs
* Reducing development time

## Tech Stack

* ArcGIS Experience Builder
* React
* TypeScript
* Node.js
* Model Context Protocol (MCP)
* Claude AI

## Blog Post

Read the full implementation walkthrough:

https://medium.com/@anushakiran156/from-prompt-to-widget-in-seconds-how-i-embedded-an-ai-developer-inside-arcgis-experience-builder-b23c5a16b9ab

## Author

**Anusha Kiran**

GeoAI Developer | ArcGIS Experience Builder Developer | AI & Geospatial Solutions


