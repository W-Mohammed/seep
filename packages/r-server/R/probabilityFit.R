probabilityFit <- function(
    values, 
    probabilities, 
    xMin = -Inf, 
    xMax = Inf, 
    nx = 20
    ){

    require(jsonlite)
    if(is.null(xMin)) xMin = -Inf
    if(is.null(xMax)) xMax = Inf
    if(is.null(nx)) nx = 20

    tryCatch({
        minX <- min(values)
        maxX <- max(values)
        d100th <- (maxX - minX)/100
        xVals <- seq(minX+d100th, maxX-d100th, length.out = nx)
        myFit <- fitdist(vals = values, probs = probabilities, lower = xMin, upper = xMax)
        preds <- feedbacksingle(myFit, values = xVals, sf=10)
        out = list(
            bestFit = myFit$best.fitting[1,1],
            x = xVals,
            y = list(),
            models = list()
        )

        for(col in colnames(preds$fitted.probabilities)){
            if(is.na(preds$fitted.probabilities[1,col])){
                next
            }
            if(col == 'hist'){
                next
            }
            out$y[[col]] <- preds$fitted.probabilities[,col]
            col_ <- translateDist(col)
            out$models[[col]] <-  as.list(myFit[col_][[1]][1,])
        }


        return(jsonlite::toJSON(out, pretty = TRUE, auto_unbox = TRUE))
    }, error = function(e){
        out <- list(success = FALSE, error = e$message)
        return(jsonlite::toJSON(out, pretty = TRUE, auto_unbox = TRUE))
    })

}




# EXAMPLE USAGE

# values <- c(10,20,30,50,60)
# probabilities <- c(0.025,0.25,0.5,0.75,0.975)
# xMin <- 0
# xMax <- 100
# nx <- 100

# probabilityFit(values, probabilities, xMin, xMax, nx)

# probabilityFit(values, probabilities, xMin = -Inf, xMax = Inf, nx)
