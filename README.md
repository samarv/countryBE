# Idea -> thoughts -> todos

# Requirements

1. Build a simple web frontend that requests autocomplete results from the backend,
   and then shows them to the user.

2. Build a simple backend that loads country data from this JSON file: countries_metadata.json

3. The backend should ask for the current position by calling this geolocation service:
   http://api.ipstack.com/check?access_key=a1d5abe0fd6709ed6ee80744cc29def2 (see below for details)

4. The backend should handle the autocomplete requests from the frontend.
   It should filter and sort countries by ascending distance to the current position, then return the results.

1) BE Loads country data
2) FE -> Search term -> BE
3) BE gets IP from request (only if search term is 1 letter long only for first)
4) BE gets Lat/long from IP (only if search term is 1 letter long i.e. only for first)
5) Filter and sort for the search keyword
6) Filter and sort for closest location in country JSON
7) Return 5 closest countries (with name and png)
