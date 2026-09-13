#!/bin/bash
set -e

echo "=> Iniciando Setup del VPS para Yield Studio Hub..."

# Actualizar sistema
echo "=> Actualizando paquetes..."
sudo apt-get update && sudo apt-get upgrade -y

# Instalar dependencias esenciales
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Instalar Docker
if ! command -v docker &> /dev/null; then
    echo "=> Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "=> Docker ya está instalado."
fi

# Instalar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "=> Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "=> Docker Compose ya está instalado."
fi

# Crear estructura de carpetas
echo "=> Creando directorios base en /opt/yield-studio..."
sudo mkdir -p /opt/yield-studio
sudo chown -R $USER:$USER /opt/yield-studio

echo "=> ¡Setup completado! Por favor, reconéctate a la sesión SSH para que los permisos de Docker tengan efecto."
echo "Luego puedes ejecutar: cd /opt/yield-studio && git clone <repo-url> ."
