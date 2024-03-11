# BUILD
 
The project is built on `gitlab-runner = radis-manager` (192.168.162.157). \
Configuration for `master` branch and all other branches is as follows:

## Master branch
After `npm install`, the project is copied to `/radis-manager/master.radis-manager.balkantel.net/`

## Non master branches
After `npm install`, the project is copied to `/radis-manager/devel.radis-manager.balkantel.net/`

# Web server
Web server `nginx` is used on gitlab runner, with two virtual hosts: 

http://master.radis-manager.balkantel.net/ - for  master branch

```
server{
listen 80;
server_name master.radis-manager.balkantel.net www.master.radis-manager.balkantel.net ;
location /{
        autoindex on;
        root /radis-manager/master.radis-manager.balkantel.net ;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
}
}
```


http://devel.radis-manager.balkantel.net/ - for all branches except master


```
server{
listen 80;
server_name devel.radis-manager.balkantel.net www.devel.radis-manager.balkantel.net ;
location /{
        autoindex on;
        root /radis-manager/devel.radis-manager.balkantel.net ;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3033;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        # }
}
}
```

# Systemd
 `Systemd` is used to start the applications for master and non-master branches.

`master-radis-manager.service:`
```
[Unit]
Description=master-radis-manager NodeJS server, NextJS public frontend
After=network.target

[Service]
Type=simple
User=root
Group=root
Restart=on-failure
RestartSec=10
WorkingDirectory=/radis-manager/master.radis-manager.balkantel.net
ExecStartPre=/usr/bin/npm install
#ExecStartPre=/usr/bin/npm run build
ExecStart=/usr/bin/npm run dev -- --port=3000

[Install]
WantedBy=multi-user.target
```
`devel-radis-manager.service:`
```
[Unit]
Description=devel-radis-manager NodeJS server, NextJS public frontend
After=network.target

[Service]
Type=simple
User=root
Group=root
Restart=on-failure
RestartSec=10
WorkingDirectory=/radis-manager/devel.radis-manager.balkantel.net
ExecStartPre=/usr/bin/npm install
#ExecStartPre=/usr/bin/npm run build
ExecStart=/usr/bin/npm run dev -- --port=3033

[Install]
WantedBy=multi-user.target
```