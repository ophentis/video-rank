###### install
```
$ npm install
```

###### run
```
$ npm start
```


###### local development
```
# Start minikube
minikube start

# Set docker env
eval $(minikube docker-env)

# Build image
docker build -t local:video-rank .

# Run in minikube
kubectl run hello-foo --image=local:video-rank --image-pull-policy=Never

# Check that it's running
kubectl get pods
```
