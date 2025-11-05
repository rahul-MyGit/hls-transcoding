# 🎥 HLS Video Transcoding Platform

A scalable, distributed video transcoding platform that converts uploaded videos into HLS (HTTP Live Streaming) format with multiple quality variants. Built with a microservices architecture leveraging AWS services for reliable, production-grade video processing.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Deployment](#deployment)

## 🌟 Overview

This platform provides a complete solution for video transcoding and streaming:

- **Upload**: Users upload videos through a modern Next.js frontend
- **Processing**: Videos are automatically transcoded into HLS format with multiple resolutions (360p, 480p, 720p, 1080p)
- **Streaming**: Transcoded videos are delivered via HLS with adaptive bitrate streaming
- **Scalability**: Leverages AWS ECS for containerized transcoding jobs that scale on demand

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (Next.js)
│  (Upload UI)│
└──────┬──────┘
       │
       ▼
┌─────────────────┐         ┌──────────────┐
│     Backend     │◄────────│  PostgreSQL  │
│  (Express API)  │         │   (Prisma)   │
└────────┬────────┘         └──────────────┘
         │                           
         │ S3 Upload                 
         ▼                           
┌─────────────────┐         ┌──────────────┐
│   AWS S3        │────────►│  AWS SQS     │
│ (Video Storage) │  Event  │  (Job Queue) │
└─────────────────┘         └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │  SQS Worker  │
                            │  (Polling)   │
                            └──────┬───────┘
                                   │ Spawns Task
                                   ▼
                            ┌──────────────┐
                            │   AWS ECS    │
                            │ (Transcoding)│
                            └──────┬───────┘
                                   │
                                   ▼
┌─────────────────┐         ┌──────────────┐
│   AWS S3        │◄────────│   FFmpeg     │
│ (HLS Outputs)   │  Upload │ Transcoding  │
└─────────────────┘         └──────────────┘
         │
         │ Stream HLS
         ▼
┌─────────────────┐
│   Frontend      │
│ (Video Player)  │
└─────────────────┘
```

## ✨ Features

- **Video Upload**: Drag-and-drop video upload with presigned S3 URLs
- **User Authentication**: Google OAuth 2.0 integration with Passport.js
- **HLS Transcoding**: Automatic conversion to HLS format with multiple quality variants
  - 360p
  - 480p
  - 720p
  - 1080p
- **Adaptive Bitrate Streaming**: Video.js player with quality selector
- **Real-time Status Tracking**: Redis-based status updates (uploading, processing, processed, failed)
- **Scalable Processing**: AWS ECS Fargate for on-demand transcoding capacity
- **Rate Limiting**: API protection with express-rate-limit
- **Session Management**: Secure cookie-based sessions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Video.js**: HLS video player with quality selection
- **Radix UI**: Accessible component primitives
- **Axios**: HTTP client

### Backend
- **Node.js + Express**: RESTful API server
- **TypeScript**: Type-safe server code
- **Prisma ORM**: PostgreSQL database management
- **Passport.js**: Google OAuth authentication
- **JWT**: Token-based authentication
- **Zod**: Input validation
- **bcrypt**: Password hashing

### Infrastructure
- **AWS S3**: Video storage
- **AWS SQS**: Message queue for transcoding jobs
- **AWS ECS Fargate**: Containerized transcoding workers
- **Redis (ioredis)**: Status tracking and caching
- **PostgreSQL**: User and session data
- **FFmpeg**: Video transcoding engine

### SQS Worker
- **Node.js**: Job polling and orchestration
- **AWS SDK v3**: SQS and ECS integration
- **Redis**: Status management

### Transcoding Service
- **Node.js**: Transcoding orchestration
- **FFmpeg**: Video processing
- **AWS SDK v3**: S3 operations

## 📦 Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis
- AWS Account with:
  - S3 bucket
  - SQS queue
  - ECS cluster
  - IAM credentials
- Docker (for ECS deployment)
- FFmpeg (for local transcoding development)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hls-transcoding
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# SQS Worker
cd ../sqsworker
npm install

# Transcoding Service
cd ../transcoding
npm install
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Build TypeScript Projects

```bash
# Backend
cd backend
tsc -b

# SQS Worker
cd ../sqsworker
tsc -b

# Transcoding Service
cd ../transcoding
tsc -b
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hls_transcoding"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-video-bucket

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### SQS Worker (.env)

```env
# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_SQS_QUEUE_URL=your_sqs_queue_url
AWS_ECS_CLUSTER=your_ecs_cluster
AWS_ECS_TASK_DEFINITION=your_task_definition
AWS_ECS_SUBNET=your_subnet_id
AWS_ECS_SECURITY_GROUP=your_security_group_id

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Transcoding Service (.env)

```env
# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# S3 Buckets
VIDEO_BUCKET=your-input-bucket
OUTPUT_BUCKET=your-output-bucket
VIDEO_KEY=video-filename.mp4

# Paths
INPUT_FILE_PATH=/tmp/input.mp4
OUTPUT_FILE_PATH=/tmp/output

# Resolutions
RESOLUTION=360,480,720,1080

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🔄 How It Works

### Upload Flow

1. **User uploads video** via frontend drag-and-drop interface
2. **Frontend requests presigned URL** from backend API
3. **Backend generates presigned S3 URL** and marks video as "uploading" in Redis
4. **Frontend uploads directly to S3** using presigned URL
5. **S3 triggers event** to SQS queue on successful upload
6. **Status updated to "uploaded"** via backend API

### Transcoding Flow

1. **SQS Worker polls queue** for new video upload events
2. **Worker parses S3 event** to extract bucket and key
3. **Status updated to "processing"** in Redis
4. **Worker spawns ECS Fargate task** with video details as environment variables
5. **ECS container starts transcoding service**:
   - Downloads original video from S3
   - Runs FFmpeg to create HLS variants (360p, 480p, 720p, 1080p)
   - Generates .m3u8 playlists and .ts segments for each resolution
   - Uploads all transcoded files back to S3
6. **Status updated to "processed"** in Redis
7. **Video available for streaming** via frontend player

### Streaming Flow

1. **User navigates to video page** (`/video/[videoId]`)
2. **Video.js player loads master playlist** from S3
3. **Player automatically selects quality** based on bandwidth
4. **User can manually switch quality** using quality selector
5. **Adaptive streaming delivers** optimal viewing experience

## 📁 Project Structure

```
hls-transcoding/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Configuration (passport, types, zod)
│   │   ├── controller/     # Route controllers
│   │   ├── db/            # Prisma client
│   │   ├── lib/           # AWS, Redis, rate limiter
│   │   ├── middleware/    # Authentication middleware
│   │   ├── route/         # API routes
│   │   └── types/         # TypeScript types
│   └── prisma/            # Database schema & migrations
│
├── frontend/               # Next.js application
│   └── src/
│       ├── app/           # App router pages
│       ├── components/    # React components
│       └── lib/           # Utilities
│
├── sqsworker/             # SQS polling service
│   └── src/
│       ├── config/        # Environment config
│       ├── lib/           # ECS, SQS, Redis clients
│       └── types/         # TypeScript types
│
└── transcoding/           # FFmpeg transcoding service
    └── src/
        ├── config/        # Environment config
        └── lib/           # S3, Redis, transcoding logic
```

## 🌐 API Endpoints

### Authentication

```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login user
GET    /api/v1/auth/google            # Google OAuth redirect
GET    /api/v1/auth/google/callback   # Google OAuth callback
POST   /api/v1/auth/logout            # Logout user
```

### Video Upload

```
POST   /api/v1/upload                 # Get presigned S3 URL
Body: { filename: string }
Response: { presignUrl: string }
```

### Video Management

```
GET    /api/v1/video/all              # Get all videos with status
GET    /api/v1/video/:id              # Get single video status
POST   /api/v1/video/updateStatus     # Update video status
Body: { id: string }
```

## 💻 Development

### Start Backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

### Start Frontend

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Start SQS Worker

```bash
cd sqsworker
npm start
# Worker polls SQS queue continuously
```

### Run Transcoding Service Locally

```bash
cd transcoding
# Set environment variables for VIDEO_KEY
npm start
# Processes single video
```

## 🚢 Deployment

### AWS Infrastructure Setup

#### 1. S3 Buckets
- Create input bucket for uploaded videos
- Create output bucket for transcoded HLS files
- Enable S3 event notifications to SQS

#### 2. SQS Queue
- Create standard SQS queue
- Configure S3 to send events on object creation

#### 3. ECS Cluster
- Create ECS Fargate cluster
- Create task definition for transcoding service
- Configure task with sufficient CPU/memory (4 vCPU, 8 GB recommended)
- Mount EFS or use ephemeral storage for temporary files

#### 4. Docker Image for Transcoding
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY transcoding/package*.json ./
RUN npm install
COPY transcoding/ ./
RUN npm run build
CMD ["npm", "start"]
```

#### 5. IAM Permissions
- S3 read/write access
- SQS send/receive/delete messages
- ECS run task permissions

### Backend Deployment
- Deploy to AWS EC2, ECS, or serverless platforms (Vercel, Railway)
- Ensure PostgreSQL and Redis are accessible
- Set production environment variables

### Frontend Deployment
- Deploy to Vercel, Netlify, or AWS Amplify
- Update API URLs to production backend

### SQS Worker Deployment
- Deploy to AWS ECS, EC2, or long-running container service
- Ensure continuous operation for queue polling

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using TypeScript, Next.js, and AWS
