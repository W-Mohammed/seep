library(jsonlite)
library(plumber)

# source SHELF.min
files <- list.files("./R", full.names = TRUE)
for (file in files) {
  source(file)
}

port <- 8000
pr("./routes.R") %>%
   pr_set_docs(FALSE)  %>% 
   pr_run(port = port)
