library(tidyr);
library(dplyr);
library(ggplot2);

# Load data
data <- read.csv("scripts/data/baumkataster.csv");

# Turn data into a tibble
raw_tibble <- as_tibble(data);

tidy_data <- raw_tibble %>%
    mutate(poi_id,
    status = as.factor(status),
    type = as.factor(baumtyp),
    quarter = as.factor(quartier),
    year = as.factor(pflanzjahr),
    genus = as.factor(baumgattunglat),
    species = as.factor(baumartlat),
    category = as.factor(kategorie),
    size = as.factor(baumtyp),
    ) %>%
    select(poi_id, status, type, quarter, year, genus, species, category, size)

# examine structure
str(tidy_data)
head(tidy_data)

# how many trees are there of each species?
grouped <- tidy_data %>%
group_by(genus,species) %>%
summarize(count= n(),) %>%
arrange(desc(count)) %>%
mutate(tree = paste(genus, species, sep = " "))

#    genus    species       count
#    <fct>    <fct>         <int>
#  1 Acer     platanoides    4700
#  2 Malus    domestica      4258
#  3 Carpinus betulus        4141
#  4 Platanus x hispanica    3094
#  5 Betula   pendula        3091
#  6 Acer     campestre      2964
#  7 Aesculus hippocastanum  2390
#  8 Fraxinus excelsior      2364
#  9 Taxus    baccata        2337
# 10 Pinus    sylvestris     2314

# how many groups are there
grouped %>% nrow() # 498

# save as csv
write.csv(grouped, "scripts/data/grouped.csv", row.names = FALSE)

