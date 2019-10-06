# Development Setup for Windows

On Windows, it is recommended to setup "Windows Subsystem for Linux (WSL)" with Ubuntu for development.

Follow below instructions to complete the setup:

## Part 1: Installing Ubuntu on Windows

1. Follow up to Part-3 of this [wiki](https://www.wikihow.com/Enable-the-Windows-Subsystem-for-Linux) to enable WSL.
2. Now, get [Ubuntu App](https://www.microsoft.com/en-in/p/ubuntu/9nblggh4msv6) from Microsoft Store.
3. Launch the App and let it install.
4. Choose your username and password for Ubuntu.

## Part 2: Setting up Zsh

You can skip this part, if you don't want to use `zsh` as your Unix shell.

Install zsh and oh-my-zsh using following commands:

```bash
sudo apt-get install zsh
curl -L https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh | bash
```

Remove git plugin from `.zshrc` file.

### Part 3: Setting up Cmder

You can skip this part, if you don't want to use `cmder` as your Console Emulator.

1. Download and install [Cmder](https://cmder.net/).
2. Launch Cmder and navigate to `Settings > Startup > Tasks`.
3. Add new task with following values:

```bash
Name = bash::ubuntu
Task Parameters = /icon "%CMDER_ROOT%\icons\cmder.ico"
Commands = %windir%\system32\bash.exe ~ -c zsh -cur_console:p
```

_You can setup this task as default on `Settings > Startup` screen._

## Part 4: Setting up Ubuntu

Launch Cmder with `{bash:ubuntu}` task setup in Part-3 or Ubuntu App Terminal.

Run following commands to make Ubuntu ready for development:

```bash
# Update dependencies and installing build essentials
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential libssl-dev

# Install Python 2.7
sudo apt install python2.7 python-pip

# Install NVM
# If you are using zsh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | zsh
# If you are using bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash

# Install Node version 10.16.0 using NVM
nvm install 10.16.0

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Development setup for Windows is now complete, you can continue following [README](./README.md).
