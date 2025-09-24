# Structured Expert Elicitation Platform (SEEP)

by Dark Peak Analytics Ltd, 2025

> This repository contains the code for the Structured Expert Elicitation Platform (SEEP), a project that is no longer under active development.

## Overview

The Structured Expert Elicitation Platform (SEEP) is a web application designed to facilitate the collection and aggregation of expert judgments. Admins can create surveys and workshops with various question types for experts. Experts participate by submitting their judgments. Both individual and aggregated results can be reviewed and exported.

This repository contains the source code and configurations needed to run the platform.

Contact: [contact@darkpeakanalytics.com](mailto:contact@darkpeakanalytics.com)

---

## TOC

- [1 Installation](#installation)
- [2 Start Development Environment](#start-development-environment)
- [3 Start Production Environment](#start-production-environment)
- [4 SEEP Features](#main-features)

## 1 Installation

### Overview

The platform is deployed using Docker. There are two environments:

- **Local Development** (`npm run docker:dev`) for development purposes on your local machine
- **Production**: `npm run docker:prod` for production purposes on a remote server


The docker based setup uses the following techstack:

- **Node.js**
- **R** 
- **MongoDB**
- **Nginx**
- **Vue.js**

The production environment assumes that you have a domain name and SSL certificates.


### Prerequisites

1. **Docker**: Ensure Docker and Docker Compose are installed.
2. **Environment Variables**: Configure `.env` files (see below).
3. **AWS Credentials** (optional): We used AWS SES for email sending. If you do not need email sending, you can skip this step.


## 2 Start Development Environment

1. Clone the repository
  
```bash
git clone https://github.com/priorb-source/see-platform.git
```

2. Create `.env.dev` file and set the environment variables

```bash
NODE_ENV=development
R_SERVER_HOST=r-server:8000
CLIENT_HOST=http://localhost:5173
NODE_HOST=http://localhost:3000
DB_URL=mongodb://mongo:27017/see?replicaSet=rs0
NGINX_CONF=local.conf
JWT_SECRET={{A_VERY_LONG_SECRET}}
# Initial admin user credentials
ADMIN_USERNAME={{YOUR_ADMIN_USERNAME}} # e.g. admin@darkpeakanalytics.com
ADMIN_PASSWORD={{YOUR_ADMIN_PASSWORD}} # e.g. SEEP123!
ORGANISATION_NAME={{YOUR_ORGANISATION_NAME}} # e.g. DPA
# OPTIONAL (for AWS SES)
AWS_ACCESS_KEY_ID={{AWS_ACCESS_KEY_ID}}
AWS_SECRET_ACCESS_KEY={{AWS_SECRET_ACCESS_KEY}}
AWS_REGION={{AWS_REGION}}
```

3. Start the Development Environment
```bash
npm run docker:dev
```





## 3 Start Production Environment

1. Clone the repository
  
```bash
git clone https://github.com/priorb-source/see-platform.git
```

2. Create `.env.prod` file and set the environment variables

```bash
NODE_ENV=production
R_SERVER_HOST=r-server:8000
CLIENT_HOST={{YOUR_DOMAIN}} # e.g. https://darkpeakanalytics.com
NODE_HOST={{YOUR_BACKEND_DOMAIN}} # e.g. https://api.darkpeakanalytics.com
# MongoDB URL can be remote cluster URL or local path 
DB_URL={{LOCAL_MONGODB_PATH_OR_REMOTE_URL}} # (local: mongodb://mongo:27017/see?replicaSet=rs0)
JWT_SECRET={{A_VERY_LONG_SECRET}}
NGINX_CONF=prod.conf
CLIENT_SSL_DIR={{PATH_TO_CLIENT_SSL_CERTIFICATES}}
SERVER_SSL_DIR={{PATH_TO_SERVER_SSL_CERTIFICATES}}
# Initial admin user credentials
ADMIN_USERNAME={{YOUR_ADMIN_USERNAME}} # e.g. admin@darkpeakanalytics.com
ADMIN_PASSWORD={{YOUR_ADMIN_PASSWORD}} # e.g. SEEP123!
ORGANISATION_NAME={{YOUR_ORGANISATION_NAME}} # e.g. DPA
# OPTIONAL (for AWS SES)
AWS_ACCESS_KEY_ID={{AWS_ACCESS_KEY_ID}}
AWS_SECRET_ACCESS_KEY={{AWS_SECRET_ACCESS_KEY}}
AWS_REGION={{AWS_REGION}}
```

3. SSL Certificates

Modify the `nginx/prod.conf` file to point to your SSL certificates and use your domain name.

To obtain SSL certificates, check with your organization's IT team or DevOps team for guidance or use [Certbot](https://certbot.eff.org/) to generate free certificates.

Place the SSL certificates in the directories specified in the `.env.prod` file:

- **Frontend**: `CLIENT_SSL_DIR` (e.g., `/etc/letsencrypt/live/{{YOUR_DOMAIN}}/`)
- **Backend**: `SERVER_SSL_DIR` (e.g., `/etc/letsencrypt/live/{{YOUR_BACKEND_DOMAIN}}/`)

**Required files**:

- `fullchain.pem`: The certificate chain.
- `privkey.pem`: The private key.
- `cert.pem` (if applicable): The main certificate file.

1. Start the Production Environment

```bash
npm run docker:prod
```


## 4 SEEP Features

- **Survey Creation**: Admins can create and manage surveys with diverse question types.
- **Expert Participation**: Experts can submit their responses via a user-friendly interface.
- **Data Analysis**: Aggregated results and individual responses are accessible to admins.

---

- **Export Surveys**:  
  Allows experts or administrators to generate a PDF version of the survey. This feature is helpful for sharing results with relevant stakeholders or for discussions.

- **Comment**:  
  Enables experts and administrators to add notes or comments to survey questions, allowing them to highlight important points or provide context.

- **Download Results**:  
  Provides the ability to export survey results as a CSV file, making it easier to analyze the data or integrate it with other tools.

---

## Question Types

The SEE Platform supports a diverse range of question types, ensuring a flexible and comprehensive survey experience:

### 1. **Low-High-Best Estimate Questions**

- Respondents provide a minimum, maximum, and best estimate for a given query.
- Captures ranges and distributions of expert opinions, making it ideal for uncertainty estimation.

### 2. **Matrix Questions**

- Structured as a table, with rows for sub-questions and columns for predefined options (e.g., Yes/No/Don't Know).
- Facilitates grouped responses and comparisons.

### 3. **Text-Based Questions**

- Experts provide detailed, qualitative feedback.
- Well-suited for collecting rationales, explanations, or open-ended responses.

### 4. **Multiple Choice Questions**

- Experts choose one or more answers from predefined options.
- Supports both single-answer and multi-answer formats, offering flexibility for various survey needs.

### 5. **Numerical Questions**

- Experts provide an exact number as their response.
- Ideal for collecting strictly quantitative data.

### 6. **Probability Questions**

- A **fixed-intervall** method for structured expert elicitation.
- Experts estimate the percentiles of a distribution function by comparing fixed values of the variable.
- Includes features for allocating probabilities to potential values and generating a density function to validate responses.

### 7. **Roulette Chips and Bins Questions**

- Implements the **Roulette Chips and Bins** method, a structured expert elicitation technique:
  - Experts define a range and divide possible outcomes into bins (or buckets).
  - Chips are allocated to bins, representing probabilities.
  - The chip distribution forms a probability distribution over the bins.

### 8. **Validation Pages**

- Designed to ensure consistency and accuracy in expert responses:
  - Groups related questions (e.g., Roulette Chips, Low-High-Best Estimate, or Probability questions).
  - Displays expert responses side-by-side in visual plots for comparison.
  - Allows experts to refine their answers if inconsistencies are detected.

### 9. **Radio Likert Questions**

- Measures attitudes, opinions, or perceptions on an ordinal scale using radio buttons.
- Simplifies rating responses (e.g., Strongly Agree to Strongly Disagree) for participants, offering an intuitive and familiar experience.

---

Each question type is designed to collect structured or unstructured data, tailored to the specific needs of the survey.

---


## Acknowledgements

This project is built on a lot of amazing open source projects, including the [SHELF](https://cran.r-project.org/web/packages/SHELF/index.html) R package for expert elicitation methods by Jeremy Oakley. Special thanks to [BhanukaRC](https://github.com/BhanukaRC) for his invaluable contributions.


&copy; 2025 Dark Peak Analytics. All rights reserved.


