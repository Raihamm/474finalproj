import pandas as pd
import numpy as np
import matplotlib.pyplot as plt 
df = pd.read_csv("data/MM_14_21.csv")

df = df[["Incident Date","Year", "Reported Month", "Region", "Number Dead"]]
# In order to view the data in chronological order we must first categorically sort the months
months = ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"]
df['Reported Month'] = pd.Categorical(df['Reported Month'], categories=months, ordered=True)
dfSubset = df[(df["Year"] == 2021) & (df["Region"] == "North America")]
totalDeadMonthly = dfSubset[["Reported Month", "Number Dead"]].groupby("Reported Month").sum()
monthlyDeaths = totalDeadMonthly["Number Dead"]
plt.rcParams["figure.figsize"] = [10,3.50]
plt.rcParams["figure.autolayout"] = True
plt.plot(months, monthlyDeaths)