run:
	go run ./cmd/main.go

build:
	go build -o app ./cmd/main.go

start: build
	./app

clean: 
	rm -f app

tidy: 
	go mod tidy
