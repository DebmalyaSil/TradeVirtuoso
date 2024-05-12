import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import yfinance as yf
import pandas_ta as ta
import datetime as dt
from pandas_datareader import data as pdr
import mplfinance as mpf

def res_sup(data):
    def draw_candle(sample_df,lines,region =None):
        f=plt.figure()
        f.set_figwidth(15)
        f.set_figwidth(10)

        width =0.4
        width2 =0.05

        up = sample_df[sample_df.Close>=sample_df.Open]
        down = sample_df[sample_df.Close<=sample_df.Open]

        col1 = 'green'
        col2 = 'red'

        plt.bar(up.index,up.Close-up.Open,width,bottom=up.Open,color=col1)
        plt.bar(up.index,up.High-up.Close,width2,bottom=up.Close,color=col1)
        plt.bar(up.index,up.Low-up.Open,width2,bottom=up.Open,color=col1)

        plt.bar(down.index,down.Close-down.Open,width,bottom=down.Open,color=col2)
        plt.bar(down.index,down.High-down.Open,width2,bottom=down.Open,color=col2)
        plt.bar(down.index,down.Low-down.Close,width2,bottom=down.Close,color=col2)

        plt.xticks(rotation=45,ha='right')

        for x in lines:
            plt.hlines(x,xmin=sample_df.index[0], xmax = sample_df.index[-1])
            if region is not None:
                plt.fill_between(sample_df.index,x-x*region,x+x*region,alpha=0.4)
        st.pyplot(fig)

    sample_df = data.copy()
    # sample = data.iloc[slice_][["Close"]].to_numpy().flatten()
    sample = data[["Close"]].to_numpy().flatten()
    sample_original = sample.copy()
    
    from scipy.signal import argrelextrema

    maxima = argrelextrema(sample, np.greater)
    minima = argrelextrema(sample, np.less)

    extrema = np.concatenate((maxima,minima),axis=1)[0]
    extrema_prices = np.concatenate((sample[maxima],sample[minima]))
    
    from sklearn.neighbors import  KernelDensity

    initial_price = extrema_prices[0]
    print(initial_price)

    kde = KernelDensity(kernel='gaussian',bandwidth = initial_price/155).fit(extrema_prices.reshape(-1,1))

    a,b = min(extrema_prices), max(extrema_prices)
    price_range = np.linspace(a,b,1000).reshape(-1,1)
    pdf = np.exp(kde.score_samples(price_range))
    
    from scipy.signal import find_peaks
    peaks = find_peaks(pdf)[0]
    
    df = data.copy()
    peaks_range=[2,4]
    no_peaks=-999


    sample = data[["Close"]].to_numpy().flatten()
    sample_original = sample.copy()

    from scipy.signal import argrelextrema

    maxima = argrelextrema(sample, np.greater)
    minima = argrelextrema(sample, np.less)

    extrema = np.concatenate((maxima,minima),axis=1)[0]
    extrema_prices = np.concatenate((sample[maxima],sample[minima]))
    interval = extrema_prices[0]/1000

    bandwidth=interval

    while no_peaks < peaks_range[0] or no_peaks> peaks_range[1]:
        from sklearn.neighbors import  KernelDensity

        initial_price = extrema_prices[0]
        print(initial_price)

        kde = KernelDensity(kernel='gaussian',bandwidth = initial_price/155).fit(extrema_prices.reshape(-1,1))

        a,b = min(extrema_prices), max(extrema_prices)
        price_range = np.linspace(a,b,1000).reshape(-1,1)
        pdf = np.exp(kde.score_samples(price_range))
        peaks= find_peaks(pdf)[0]

        no_peaks = len(peaks)
        bandwidth +=interval

        if bandwidth > 1000*interval:
            print("Failed to converge, stopping...")
            break
    candle_stick(df,price_range[peaks],region=0.002)
    line_chart(df, price_range[peaks],region=0.002,mavg=3)
    
    