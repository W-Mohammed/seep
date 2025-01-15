# install.packages("jsonlite")
# library(jsonlite)
# rm(list = ls())
# source("./utilityFuncs.R")

chipsAndBinsPsa <- function(expertData = NULL, model = "best", psaSamples = 1000, xMinLimit = -Inf, xMaxLimit = Inf, json = TRUE) {
  
  require(jsonlite)

  # filter out experts with no chips 
  filtered <- filterOutInvalidData(expertData)
  expertData <- filtered$expertData
  warningMsg <- filtered$warningMsg


  if(length(expertData) == 0){
    response <- list(success = FALSE, error = "All experts removed due to invalid data")
    return(jsonlite::toJSON(response, pretty = TRUE, auto_unbox = TRUE))
  }
  if(length(expertData) == 1){
    response <- list(success = FALSE, error = "Pooled estimation requires data from at least two experts")
    return(jsonlite::toJSON(response, pretty = TRUE, auto_unbox = TRUE))
  }

  xMinLimit <- as.numeric(xMinLimit)
  if(is.na(xMinLimit)){
    xMinLimit <- -Inf
  }
  xMaxLimit <- as.numeric(xMaxLimit)
  if(is.na(xMaxLimit)){
    xMaxLimit <- Inf
  }

  psaSamples <- as.integer(psaSamples)

  # adjustment, making SHELF::fitdist() work for any chips allocation
  valuesAdj <- sapply(expertData, \(x){
    binWidth <- (x$xMax - x$xMin) / length(x$chips)
    xMinAdjusted <- x$xMin + binWidth/200
    xMaxAdjusted <- x$xMax - binWidth/200
    xTemp <- seq(xMinAdjusted, xMaxAdjusted, length.out = length(x$chips)+1)
    return(c(xTemp, x$xMax))
  })

  propsAdj <- sapply(expertData, \(expert){
    y <- expert$chips
    chipsTot <- sum(y) 
    temp <- c(0,y,0)
    chipSplit <- chipsTot/198 
    temp[which(temp > 0)[1]-1] <- chipSplit
    temp[which(temp > 0)[length(which(temp > 0))]+1] <- chipSplit
    return(cumsum(temp)/sum(temp))
  })

  weights <- sapply(expertData, \(x) ifelse(is.null(x$weight), 1, x$weight))

  # fit it!
  suppressWarnings({
    fitAdj <- fitdist(
      vals = valuesAdj, 
      probs = propsAdj,
      lower = xMinLimit, 
      upper = xMaxLimit,
      weights = weights,
      expertnames = names(expertData)
    )

    sampledData <- rlinearpool(
      fit = fitAdj, 
      n = psaSamples,
      d = model, 
      w = weights
    )
    sampledData[sampledData < xMinLimit] <- xMinLimit
    sampledData[sampledData > xMaxLimit] <- xMaxLimit
  })

  
  # return response
  if (json) {
    response <- list(success = TRUE, data = sampledData)
    return(jsonlite::toJSON(response, pretty = TRUE, auto_unbox = TRUE))
  } else {
    return(sampledData)
  }
}


# # # # # Example usage:
# expertData <- list(
#   alice = list(
#     chips = c(0, 1, 2, 3, 4, 3, 2, 1, 0, 0),
#     name = "expert1",
#     xMin = 0,
#     xMax = 100,
#     xBins = 10,
#     weight = 1
#   ),
#   bob = list(
#     chips = c(0, 1, 2, 3, 3, 1, 0, 0, 0, 0),
#     name = "expert2",
#     xMin = 0,
#     xMax = 100,
#     xBins = 10,
#     weight = 1
#   ),
#   claire = list(
#     chips = c(0, 0, 0, 0, 0, 1, 2, 4, 3, 2),
#     name = "expert3",
#     xMin = 50,
#     xMax = 100,
#     weight = 1
#   )
# )

# load("./R/expertData.RData")
# res <- chipsAndBinsPsa(expertData = expertData, model = "best", psaSamples = 10000, xMinLimit = 0, xMaxLimit = 100, json = FALSE)
# hist(res)
# plot(density(res, bw = 0.001))
