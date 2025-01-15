# routes.R
library(jsonlite)

# # source SHELF.min
files <- list.files("./R", full.names = TRUE)
for (file in files) {
  source(file)
}

#* Return various SHELF analyses for chips and bins data from multiple experts
#* @param expertData a list of experts with chips and bins values: chips (array of integers), name (string),  xMin (number), xMax (number), weight (number, optional)
#* @param model a string indicating the model to use for the analysis (default = "best")
#* @post /shelf/chipsandbins
function(expertData, model = "best", nx = 100, xMinLimit = -Inf, xMaxLimit = Inf) {
    # fail safe for null from JS api
    if(is.null(xMinLimit)) xMinLimit = -Inf
    if(is.null(xMaxLimit)) xMaxLimit = Inf
    chipsAndBins(expertData = expertData, model = model, nx = nx, xMinLimit = xMinLimit, xMaxLimit = xMaxLimit)
}

#* Return PSA samples for chips and bins data for linear pooled model
#* @param expertData a list of experts with chips and bins values: chips (array of integers), name (string),  xMin (number), xMax (number), weight (number, optional)
#* @param model a string indicating the model to use for the analysis (default = "best")
#* @param psaSamples number of samples to generate (default = 1000)
#* @post /shelf/chipsandbinspsa
function(expertData, model = "best", psaSamples = 1000, xMinLimit = -Inf, xMaxLimit = Inf) {
    # fail safe for null from JS api
    if(is.null(xMinLimit)) xMinLimit = -Inf
    if(is.null(xMaxLimit)) xMaxLimit = Inf
    chipsAndBinsPsa(expertData, model, psaSamples, xMinLimit, xMaxLimit)
}

#* Return fitted probabilities for probabilityfit Method
#* @param values a vector of values
#* @param probabilities a vector of probabilities
#* @param xMin lower bound for the fitted probabilities
#* @param xMax upper bound for the fitted probabilities
#* @param nx number of points to generate for the fitted probabilities
#* @post /shelf/probabilityfit
function(values, probabilities, xMin = -Inf, xMax = Inf, nx = 20) {
    probabilityFit(values, probabilities, xMin, xMax, nx)
}

# root route
#* @get /
function() {
    "PRIORB R Plumber API serving SHELF scripts"
}