# bt_lop_20_3

Repository nay da duoc scaffold san de build Docker image va push len Docker Hub bang GitHub Actions.

## File da tao

- `Dockerfile`: build image tu `nginx:alpine`
- `.dockerignore`: loai bo file khong can dua vao image
- `.github/workflows/docker-publish.yml`: workflow CI/CD build va push image khi push len `main`
- `site/index.html`: trang mac dinh de kiem tra image da chay

## Tao Docker Hub access token

1. Dang nhap Docker Hub.
2. Vao `Account Settings` > `Personal access tokens`.
3. Tao token moi, copy token va luu lai ngay.
1
## Tao GitHub Secrets

Vao repo GitHub:

`Settings` > `Secrets and variables` > `Actions` > `New repository secret`

Tao 2 secret sau:

- `DOCKERHUB_USERNAME`: username Docker Hub cua ban
- `DOCKERHUB_TOKEN`: access token vua tao tren Docker Hub

## Tao GitHub Variable

Vao repo GitHub:

`Settings` > `Secrets and variables` > `Actions` > tab `Variables` > `New repository variable`

Tao variable:

- `DOCKERHUB_IMAGE`: ten image day du, vi du `soncoderz/bt_lop_20_3`

## Cach hoat dong

Moi lan push len nhanh `main`, GitHub Actions se:

1. Checkout code
2. Dang nhap Docker Hub
3. Build image Docker
4. Push image len Docker Hub voi tag:
   - `latest`
   - `main`
   - `sha-<commit>`

## Chay thu local

```bash
docker build -t bt_lop_20_3 .
docker run -p 8080:80 bt_lop_20_3
```

Sau do mo `http://localhost:8080`.
