# TuMascota

Página de venta de mascotas

## Linux Dependencies

# Nginx

```
    sudo apt update
    sudo apt install nginx
```

Checking nginx rules has been added correctly to UFW

```
sudo ufw app list

```

Adding nginx to UFW

```
sudo ufw allow 'Nginx Full'
```

# Node

```
cd ~
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
```

<p>This is for npm packages that need to be compiled</p>

```
sudo apt install build-essential
```

# PM2

```
sudo npm install pm2@latest -g
```

# MongoDB

```
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

```

# Redis

```
sudo apt install redis-server

```

<p>Inside /etc/redis/redis.conf search the supervised directive is set to "no" by default. You shoul put "systemd" instead</p>

```
sudo nano /etc/redis/redis.conf
sudo systemctl restar redis.service
```

# WEBP

<p>This utilitiy is needed for converting images to webp format</p>

```
sudo apt install webp
```

## Generating SSL Certificates

```
sudo apt install certbot python3-certbot-nginx

```
