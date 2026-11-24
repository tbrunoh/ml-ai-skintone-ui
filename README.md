# Skin Tone Analysis App

> A Next.js app that captures a photo and returns its Monk Skin Tone class.

**Part of [Inclusive Skin AI](https://github.com/tbrunoh#inclusive-skin-ai)**, an end to end system for skin analysis built for melanin-rich skin first. Most skin analysis models learn from lighter skin and misread darker tones; this project starts from the other end.

## What it does

Lets a person upload a photo or use their camera, sends the image to the [training data API](https://github.com/tbrunoh/ml-data-upload-api), then calls the [inference API](https://github.com/tbrunoh/ml-ai-client-api) and shows the result.

## Quickstart

```bash
git clone https://github.com/tbrunoh/ml-ai-skintone-ui.git
cd ml-ai-skintone-ui
npm install
# set API_ENDPOINT, UPLOAD_API_ENDPOINT and IMAGE_URL_PREFIX in .env
npm run dev
```

Pushes to `main` build a container and deploy it through GitHub Actions (`.github/workflows/deploy.yaml`).

## Stack

Next.js 15, React, TypeScript, Docker.

## The Inclusive Skin AI repositories

| Layer | Repository | Role |
|:--|:--|:--|
| MODEL | [ml-ai-skintone](https://github.com/tbrunoh/ml-ai-skintone) | Skin tone classifier on the Monk Skin Tone scale |
| MODEL | [ml-ai-skin-conditions](https://github.com/tbrunoh/ml-ai-skin-conditions) | Skin condition model package, early stage |
| CORE | [ml-ai-core](https://github.com/tbrunoh/ml-ai-core) | Shared PyTorch base classes and utilities |
| SERVE | [ml-ai-client-api](https://github.com/tbrunoh/ml-ai-client-api) | FastAPI inference service for the skin tone model |
| DATA | [ml-data-upload-api](https://github.com/tbrunoh/ml-data-upload-api) | FastAPI upload service feeding storage and labeling |
| DATA | [ml-data-labelling-ui](https://github.com/tbrunoh/ml-data-labelling-ui) | Label Studio deployment for image annotation |
| PRODUCT | **ml-ai-skintone-ui** | Next.js skin tone analysis app |
| PRODUCT | [ml-landing-page](https://github.com/tbrunoh/ml-landing-page) | Next.js landing page for the consumer app |
| INFRA | [ml-terraform](https://github.com/tbrunoh/ml-terraform) | Azure infrastructure as code |
| INFRA | [ml-terraform-modules](https://github.com/tbrunoh/ml-terraform-modules) | Reusable Terraform modules |
| RESEARCH | [ml-ai-samples](https://github.com/tbrunoh/ml-ai-samples) | Reference PyTorch experiments |

## Status

The cloud environment behind this project has been retired. The code is published as a reference implementation, and every endpoint, key and project identifier in configuration files is a placeholder you replace with your own.

---

<sub>Maintained by <a href="https://github.com/tbrunoh">Tom Bruno</a>. Original engineering by Nelson Kigen. Part of <a href="https://github.com/tbrunoh#inclusive-skin-ai">Inclusive Skin AI</a>.</sub>
