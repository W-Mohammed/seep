normal.error <-
function(parameters, values, probabilities, weights){
	sum(weights * (pnorm(values, parameters[1], exp(parameters[2])) - probabilities)^2)
}

# Optimise for location and scale only
skewnormal.error <- function(parameters, values, probabilities, weights, snAlpha){
  sum(weights * (sn::psn(values, xi = parameters[1],
                     omega = exp(parameters[2]),
                     alpha = snAlpha) - probabilities)^2)
}

# Optimise for location, scale and shape
skewnormal.error.joint <- function(parameters, values, probabilities, weights){
  sum(weights * (sn::psn(values, xi = parameters[1],
                         omega = exp(parameters[2]),
                         alpha = parameters[3]) - probabilities)^2)
}


tError <-
function(parameters, values, probabilities, weights, degreesfreedom){
	sum(weights * (pt((values-parameters[1]) / exp(parameters[2]),
	                  degreesfreedom) - probabilities)^2)

}

gamma.error <-
function(parameters, values, probabilities, weights){
	sum(weights * (pgamma(values, exp(parameters[1]), exp(parameters[2])) -probabilities)^2)
}

lognormal.error <-
function(parameters, values, probabilities, weights){
	sum(weights * (plnorm(values, parameters[1], exp(parameters[2])) - probabilities)^2)
}

logt.error <-
function(parameters, values, probabilities, weights, degreesfreedom){
	sum(weights * (pt((log(values) - parameters[1]) / exp(parameters[2]), degreesfreedom) - probabilities)^2)
}

beta.error <-
function(parameters, values, probabilities, weights){
	sum(weights * (pbeta(values, exp(parameters[1]), exp(parameters[2])) - probabilities)^2)
}





fitdist <- function (vals, probs, lower = -Inf, upper = Inf, weights = 1, 
    tdf = 3, expertnames = NULL, excludelogt = FALSE) 
{
    if (is.matrix(vals) == F) {
        vals <- matrix(vals, nrow = length(vals), ncol = 1)
    }
    if (is.matrix(probs) == F) {
        probs <- matrix(probs, nrow = nrow(vals), ncol = ncol(vals))
    }
    if (is.matrix(weights) == F) {
        weights <- matrix(weights, nrow = nrow(vals), ncol = ncol(vals))
    }
    if (length(lower) == 1) {
        lower <- rep(lower, ncol(vals))
    }
    if (length(upper) == 1) {
        upper <- rep(upper, ncol(vals))
    }
    if (length(tdf) == 1) {
        tdf <- rep(tdf, ncol(vals))
    }
    n.experts <- ncol(vals)
    normal.parameters <- matrix(NA, n.experts, 2)
    skewnormal.parameters <- matrix(NA, n.experts, 3)
    tParameters <- matrix(NA, n.experts, 3)
    mirrorgamma.parameters <- gamma.parameters <- matrix(NA, 
        n.experts, 2)
    mirrorlognormal.parameters <- lognormal.parameters <- matrix(NA, 
        n.experts, 2)
    mirrorlogt.parameters <- logt.parameters <- matrix(NA, n.experts, 
        3)
    beta.parameters <- matrix(NA, n.experts, 2)
    ssq <- matrix(NA, n.experts, 10)
    notes <- NULL
    colnames(ssq) <- c("normal", "t", "skewnormal", "gamma", 
        "lognormal", "logt", "beta", "mirrorgamma", "mirrorlognormal", 
        "mirrorlogt")
    if (n.experts > 1 & n.experts < 27 & is.null(expertnames)) {
        expertnames <- paste("expert.", LETTERS[1:n.experts], 
            sep = "")
    }
    if (n.experts > 27 & is.null(expertnames)) {
        expertnames <- paste("expert.", 1:n.experts, sep = "")
    }
    limits <- data.frame(lower = lower, upper = upper)
    row.names(limits) <- expertnames
    for (i in 1:n.experts) {
        if (length(probs[, i]) < 1) {
            stop("need at least one elicited probability")
        }
        if (min(probs[, i]) < 0 | max(probs[, i]) > 1) {
            stop("probabilities must be between 0 and 1")
        }
        if (min(vals[, i]) < lower[i]) {
            stop("elicited parameter values cannot be smaller than lower parameter limit")
        }
        if (max(vals[, i]) > upper[i]) {
            stop("elicited parameter values cannot be greater than upper parameter limit")
        }
        if (tdf[i] <= 0) {
            stop("Student-t degrees of freedom must be greater than 0")
        }
        inc <- (probs[, i] > 0) & (probs[, i] < 1)
        minprob <- min(probs[inc, i])
        maxprob <- max(probs[inc, i])
        minvals <- min(vals[inc, i])
        maxvals <- max(vals[inc, i])
        if ((min(probs[, i]) < 0.4) & (max(probs[, i]) > 0.6)) {
            if (min(probs[-1, i] - probs[-nrow(probs), i]) < 
                0) {
                stop("probabilities must be specified in ascending order")
            }
            if (min(vals[-1, i] - vals[-nrow(vals), i]) <= 0) {
                stop("parameter values must be specified in ascending order")
            }
            q.fit <- approx(x = probs[inc, i], y = vals[inc, 
                i], xout = c(0.4, 0.5, 0.6))$y
            l <- q.fit[1]
            u <- q.fit[3]
            minq <- qnorm(minprob)
            maxq <- qnorm(maxprob)
            m <- (minvals * maxq - maxvals * minq)/(maxq - minq)
            v <- ((maxvals - minvals)/(maxq - minq))^2
            mlog <- (log(minvals - lower[i]) * maxq - log(maxvals - 
                lower[i]) * minq)/(maxq - minq)
            mlogMirror <- (log(upper[i] - maxvals) * (1 - minq) - 
                log(upper[i] - minvals) * (1 - maxq))/(maxq - 
                minq)
            normal.fit <- optim(c(m, 0.5 * log(v)), normal.error, 
                values = vals[inc, i], probabilities = probs[inc, 
                  i], weights = weights[inc, i])
            normal.parameters[i, ] <- c(normal.fit$par[1], exp(normal.fit$par[2]))
            ssq[i, "normal"] <- normal.fit$value
            tFit <- optim(c(m, 0.5 * log(v)), tError, values = vals[inc, 
                i], probabilities = probs[inc, i], weights = weights[inc, 
                i], degreesfreedom = tdf[i])
            tParameters[i, 1:2] <- c(tFit$par[1], exp(tFit$par[2]))
            tParameters[i, 3] <- tdf[i]
            ssq[i, "t"] <- tFit$value
            if (length(vals[inc, i]) > 2) {
                alphaVec <- c(-20, -10, -5:5, 10, 20)
                delta <- alphaVec/sqrt(1 + alphaVec^2)
                eVec <- rep(0, 15)
                omegaStart <- normal.parameters[i, 2]/sqrt(1 - 
                  2 * delta^2/pi)
                xiStart <- normal.parameters[i, 1] - omegaStart * 
                  delta * sqrt(2/pi)
                for (j in 1:15) {
                  eVec[j] <- optim(c(xiStart[j], log(omegaStart[j])), 
                    skewnormal.error, values = vals[inc, i], 
                    probabilities = probs[inc, i], weights = weights[inc, 
                      i], snAlpha = alphaVec[j])$value
                }
                index <- which.min(eVec)
                skewnormal.fit <- optim(c(xiStart[index], log(omegaStart[index]), 
                  alphaVec[index]), skewnormal.error.joint, values = vals[inc, 
                  i], probabilities = probs[inc, i], weights = weights[inc, 
                  i])
                skewnormal.parameters[i, ] <- c(skewnormal.fit$par[1], 
                  exp(skewnormal.fit$par[2]), skewnormal.fit$par[3])
                ssq[i, "skewnormal"] <- skewnormal.fit$value
            }
            if (lower[i] > -Inf) {
                vals.scaled1 <- vals[inc, i] - lower[i]
                m.scaled1 <- m - lower[i]
                gamma.fit <- optim(c(log(m.scaled1^2/v), log(m.scaled1/v)), 
                  gamma.error, values = vals.scaled1, probabilities = probs[inc, 
                    i], weights = weights[inc, i])
                gamma.parameters[i, ] <- exp(gamma.fit$par)
                ssq[i, "gamma"] <- gamma.fit$value
                std <- ((log(u - lower[i]) - log(l - lower[i]))/1.35)
                lognormal.fit <- optim(c(mlog, log(std)), lognormal.error, 
                  values = vals.scaled1, probabilities = probs[inc, 
                    i], weights = weights[inc, i])
                lognormal.parameters[i, 1:2] <- c(lognormal.fit$par[1], 
                  exp(lognormal.fit$par[2]))
                ssq[i, "lognormal"] <- lognormal.fit$value
                logt.fit <- optim(c(log(m.scaled1), log(std)), 
                  logt.error, values = vals.scaled1, probabilities = probs[inc, 
                    i], weights = weights[inc, i], degreesfreedom = tdf[i])
                logt.parameters[i, 1:2] <- c(logt.fit$par[1], 
                  exp(logt.fit$par[2]))
                logt.parameters[i, 3] <- tdf[i]
                ssq[i, "logt"] <- logt.fit$value
            }
            if ((lower[i] > -Inf) & (upper[i] < Inf)) {
                vals.scaled2 <- (vals[inc, i] - lower[i])/(upper[i] - 
                  lower[i])
                m.scaled2 <- (m - lower[i])/(upper[i] - lower[i])
                v.scaled2 <- v/(upper[i] - lower[i])^2
                alp <- abs(m.scaled2^3/v.scaled2 * (1/m.scaled2 - 
                  1) - m.scaled2)
                bet <- abs(alp/m.scaled2 - alp)
                if (identical(probs[inc, i], (vals[inc, i] - 
                  lower[i])/(upper[i] - lower[i]))) {
                  alp <- bet <- 1
                }
                beta.fit <- optim(c(log(alp), log(bet)), beta.error, 
                  values = vals.scaled2, probabilities = probs[inc, 
                    i], weights = weights[inc, i])
                beta.parameters[i, ] <- exp(beta.fit$par)
                ssq[i, "beta"] <- beta.fit$value
            }
            if (upper[i] < Inf) {
                valsMirrored <- upper[i] - vals[inc, i]
                probsMirrored <- 1 - probs[inc, i]
                mMirrored <- upper[i] - m
                mirrorgamma.fit <- optim(c(log(mMirrored^2/v), 
                  log(mMirrored/v)), gamma.error, values = valsMirrored, 
                  probabilities = probsMirrored, weights = weights[inc, 
                    i])
                mirrorgamma.parameters[i, ] <- exp(mirrorgamma.fit$par)
                ssq[i, "mirrorgamma"] <- mirrorgamma.fit$value
                stdMirror <- ((log(upper[i] - l) - log(upper[i] - 
                  u))/1.35)
                mirrorlognormal.fit <- optim(c(mlogMirror, log(stdMirror)), 
                  lognormal.error, values = valsMirrored, probabilities = probsMirrored, 
                  weights = weights[inc, i])
                mirrorlognormal.parameters[i, 1:2] <- c(mirrorlognormal.fit$par[1], 
                  exp(mirrorlognormal.fit$par[2]))
                ssq[i, "mirrorlognormal"] <- mirrorlognormal.fit$value
                mirrorlogt.fit <- optim(c(log(mMirrored), log(stdMirror)), 
                  logt.error, values = valsMirrored, probabilities = probsMirrored, 
                  weights = weights[inc, i], degreesfreedom = tdf[i])
                mirrorlogt.parameters[i, 1:2] <- c(mirrorlogt.fit$par[1], 
                  exp(mirrorlogt.fit$par[2]))
                mirrorlogt.parameters[i, 3] <- tdf[i]
                ssq[i, "mirrorlogt"] <- mirrorlogt.fit$value
            }
        }
        else {
            notes <- paste0("Did not have smallest elicited probability < 0.4 and ", 
                "largest > 0.6. If lower and/or upper limits specified, ", 
                "gamma and mirror gamma are fitted with the shape ", 
                "parameter fixed at 1, i.e. an exponential distribution.")
            if (lower[i] > -Inf) {
                lambda <- -log(1 - maxprob)/(maxvals - lower[i])
                exponential.fit <- optimise(exponential.error, 
                  interval = c(0, 2 * lambda), values = vals[inc, 
                    i] - lower[i], probabilities = probs[inc, 
                    i], weights = weights[inc, i])
                gamma.parameters[i, ] <- c(1, exponential.fit$minimum)
                ssq[i, "gamma"] <- exponential.fit$objective
            }
            if (upper[i] < Inf) {
                lambda <- -log(minprob)/(upper[i] - minvals)
                mirrorexponential.fit <- optimise(exponential.error, 
                  interval = c(0, 2 * lambda), values = upper[i] - 
                    vals[inc, i], probabilities = 1 - probs[inc, 
                    i], weights = weights[inc, i])
                mirrorgamma.parameters[i, ] <- c(1, mirrorexponential.fit$minimum)
                ssq[i, "mirrorgamma"] <- mirrorexponential.fit$objective
            }
        }
    }
    dfn <- data.frame(normal.parameters)
    names(dfn) <- c("mean", "sd")
    row.names(dfn) <- expertnames
    dfsn <- data.frame(skewnormal.parameters)
    names(dfsn) <- c("location", "scale", "slant")
    row.names(dfsn) <- expertnames
    dft <- data.frame(tParameters)
    names(dft) <- c("location", "scale", "df")
    row.names(dft) <- expertnames
    dfg <- data.frame(gamma.parameters)
    names(dfg) <- c("shape", "rate")
    row.names(dfg) <- expertnames
    dfmirrorg <- data.frame(mirrorgamma.parameters)
    names(dfmirrorg) <- c("shape", "rate")
    row.names(dfmirrorg) <- expertnames
    dfln <- data.frame(lognormal.parameters)
    names(dfln) <- c("mean.log.X", "sd.log.X")
    row.names(dfln) <- expertnames
    dfmirrorln <- data.frame(mirrorlognormal.parameters)
    names(dfmirrorln) <- c("mean.log.X", "sd.log.X")
    row.names(dfmirrorln) <- expertnames
    dflt <- data.frame(logt.parameters)
    names(dflt) <- c("location.log.X", "scale.log.X", "df.log.X")
    row.names(dflt) <- expertnames
    dfmirrorlt <- data.frame(mirrorlogt.parameters)
    names(dfmirrorlt) <- c("location.log.X", "scale.log.X", "df.log.X")
    row.names(dfmirrorlt) <- expertnames
    dfb <- data.frame(beta.parameters)
    names(dfb) <- c("shape1", "shape2")
    row.names(dfb) <- expertnames
    ssq <- data.frame(ssq)
    row.names(ssq) <- expertnames
    if (excludelogt) {
        reducedssq <- ssq[, c("normal", "t", "skewnormal", "gamma", 
            "lognormal", "beta", "mirrorgamma", "mirrorlognormal")]
        index <- apply(reducedssq, 1, which.min)
        best.fitting <- data.frame(best.fit = names(reducedssq)[index])
    }
    else {
        index <- apply(ssq, 1, which.min)
        best.fitting <- data.frame(best.fit = names(ssq)[index])
    }
    row.names(best.fitting) <- expertnames
    vals <- data.frame(vals)
    names(vals) <- expertnames
    probs <- data.frame(probs)
    names(probs) <- expertnames
    fit <- list(Normal = dfn, Student.t = dft, Skewnormal = dfsn, 
        Gamma = dfg, Log.normal = dfln, Log.Student.t = dflt, 
        Beta = dfb, mirrorgamma = dfmirrorg, mirrorlognormal = dfmirrorln, 
        mirrorlogt = dfmirrorlt, ssq = ssq, best.fitting = best.fitting, 
        vals = t(vals), probs = t(probs), limits = limits, notes = notes)
    class(fit) <- "elicitation"
    fit
}
