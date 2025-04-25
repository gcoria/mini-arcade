package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
)

// GameResponse represents the API response structure
type GameResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

// setupRoutes configures all HTTP routes for the application
func setupRoutes() {
	// Serve the arcade_collection directory
	arcadeFS := http.FileServer(http.Dir("./arcade_collection"))
	http.Handle("/arcade/", http.StripPrefix("/arcade/", arcadeFS))

	// Redirect root to arcade collection
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.Redirect(w, r, "/arcade/", http.StatusSeeOther)
		} else {
			http.NotFound(w, r)
		}
	})

	// API endpoints
	setupAPIRoutes()
}

// setupAPIRoutes configures all API endpoints
func setupAPIRoutes() {
	// API base path
	apiBasePath := "/api"

	// Hello endpoint
	http.HandleFunc(filepath.Join(apiBasePath, "/hello"), helloHandler)

	// Games list endpoint
	http.HandleFunc(filepath.Join(apiBasePath, "/games"), gamesListHandler)
}

// helloHandler handles the hello endpoint
func helloHandler(w http.ResponseWriter, r *http.Request) {
	response := GameResponse{
		Message: "Hello from Go!",
		Status:  "success",
	}
	sendJSONResponse(w, response)
}

// gamesListHandler returns the list of available games
func gamesListHandler(w http.ResponseWriter, r *http.Request) {
	// This would typically fetch from a database or file system
	// For now, we're hardcoding the available games
	games := map[string]interface{}{
		"games": []map[string]string{
			{"id": "balloonPop", "name": "Balloon Pop", "description": "Pop balloons before they reach the top"},
			{"id": "memoryMatch", "name": "Memory Match", "description": "Match cards to test your memory"},
		},
	}
	sendJSONResponse(w, games)
}

// sendJSONResponse sends a JSON response with appropriate headers
func sendJSONResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
	}
}

func main() {
	// Set up all routes
	setupRoutes()

	// Start the server
	port := ":8080"
	fmt.Printf("Server started at http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
