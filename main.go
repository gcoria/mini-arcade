package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Serve static files (HTML, JS, CSS, Anime.js)
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	// Example API endpoint
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"message": "Hello from Go!"}`)
	})

	fmt.Println("Server started at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
