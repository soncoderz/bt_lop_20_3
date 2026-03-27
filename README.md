# bt_lop_20_3

Node.js/Express API project with Docker and GitHub Actions publishing to Docker Hub.

## Docker runtime

The application expects these runtime values:

- `PORT`: application port, default `3000`
- `MONGODB_URI`: MongoDB connection string, default `mongodb://localhost:27017/NNPTUD-C4`
- `JWT_PRIVATE_KEY`: RSA private key used to sign tokens
- `JWT_PUBLIC_KEY`: optional RSA public key used to verify tokens. If omitted, the app falls back to `keys/public.pem`

`keys/private.pem` is excluded from Docker build context so the private key is not baked into the image pushed to Docker Hub.

## Build locally

```bash
docker build -t soncoderz/bt_lop_20_3 .
```

## Run locally

```bash
docker run -p 3000:3000 ^
  -e PORT=3000 ^
  -e MONGODB_URI=mongodb://host.docker.internal:27017/NNPTUD-C4 ^
  -e JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----" ^
  -e JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----" ^
  soncoderz/bt_lop_20_3
```

Open `http://localhost:3000/health` to verify the container is running.

## GitHub Actions to Docker Hub

Workflow file:

- `.github/workflows/docker-publish.yml`

When code is pushed to `main`, GitHub Actions will:

1. Resolve the Docker Hub username and image name
2. Log in to Docker Hub
3. Build the Docker image
4. Push tags `latest`, `main`, and `sha-<commit>`

## GitHub secrets and variables

Create these in:

`Settings` > `Secrets and variables` > `Actions`

Secrets:

- `DOCKERHUB_TOKEN`: Docker Hub access token
- `DOCKERHUB_USERNAME`: optional if it is the same as the GitHub repo owner

Variables:

- `DOCKERHUB_IMAGE`: optional full image name, for example `soncoderz/bt_lop_20_3`
- `DOCKERHUB_USERNAME`: optional Docker Hub username if you do not want to store it as a secret

Fallback logic:

- If `DOCKERHUB_IMAGE` exists, the workflow uses it directly
- If `DOCKERHUB_IMAGE` is missing, the workflow uses `<dockerhub-username>/<github-repo-name>`
- If `DOCKERHUB_USERNAME` is also missing, the workflow falls back to `github.repository_owner`
