import numpy as np
from pandas_datareader import data as pdr
import datetime as dt
import mplfinance as mpf
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import plotly.graph_objects as go
import scipy as stats


def pattern(df):
    df.rename(columns = {'Open':'open','High':'high','Low':'low','Adj Close':'close','Volume':'volume'}, inplace =True)
    df['EMA'] = ta.ema(df.close,length=150)
        
    EMAsignal = [0]*len(df)
    backcandles= 15 

    for row in range(backcandles,len(df)):
        upt=1
        dnt=1
        for i in range(row-backcandles,row+1):
            if max(df.open[i],df.close[i])>=df.EMA[i]:
                dnt=0
            if min(df.open[i],df.close[i])<=df.EMA[i]:
                upt=0
        if upt==1 and dnt==1 :
            EMAsignal[row]=3
        elif upt==1:
            EMAsignal[row]=2
        elif dnt==1:
            EMAsignal[row]=1
    df['EMAsignal'] = EMAsignal
        
    def isPivot(candle,window):
        if candle < pd.Timestamp(df.index.date[0]) or candle+pd.Timedelta(window, unit='D')>=pd.Timestamp(df.index.date[len(df)-1]):
            return 0

        pivotHigh=1
        pivotLow=2
        for i in pd.date_range(start=candle - pd.Timedelta(window, unit='D'), end=candle + pd.Timedelta(window + 1, unit='D'), freq='D'):
            try:
                index_i = df.index.get_loc(i)
                if df.loc[candle,'low'] > df.loc[index_i,'low']:
                    pivotLow=0
                if df.loc[candle,'high'] < df.loc[index_i,'high']:
                    pivotHigh=0
            except KeyError:
                pass
        if( pivotHigh and pivotLow):
            return 3
        elif pivotHigh:
            return pivotHigh
        elif pivotLow:
            return pivotLow
        else:
            return 0
    window =10 
    df['isPivot'] = df.apply(lambda x: isPivot(x.name,window),axis=1)
        
    def pointposition(x):
        if x['isPivot']==2:
            return x['low']-1e-3
        elif x['isPivot']==1:
            return x['high']+1e-3
        else:
            return np.nan
    df['pointposition'] = df.apply(lambda row:pointposition(row),axis=1)
        
    def detect_pattern(candle,backcandles,window):
        if(candle<=pd.Timestamp(df.index.date[(backcandles+window)])) or (candle+pd.Timedelta(window+1, unit='D') >= pd.Timestamp(df.index.date[len(df)-1])):
            return 0
        localdf = df.loc[candle-pd.Timedelta(window+backcandles, unit='D'):candle-pd.Timedelta(window, unit='D')]
        highs = localdf[localdf['isPivot']==1].high.tail(3).values
        lows = localdf[localdf['isPivot']==2].low.tail(3).values
        cmp= localdf['Close'].values
        levelbreak = 0
        zone_width = cmp.mean()*0.05
        if len(lows)==3:
            support_condition = True
            mean_low = lows.mean()
            for low in lows:
                if abs(low-mean_low)>zone_width:
                    support_condition =False
                    break
            if support_condition and (mean_low - df.loc[candle].close)> zone_width*2 and df.loc[candle].EMAsignal==1:
                levelbreak=1
                    
        if len(highs)==3:
            resistance_condition = True
            mean_high = highs.mean()
            for high in highs:
                if abs(high-mean_high)>  zone_width:
                    resistance_condition =False
                    break
            if resistance_condition and (df.loc[candle].close - mean_high)> zone_width*2 and df.loc[candle].EMAsignal==2:
                levelbreak=2
        return levelbreak
    df['pattern'] = df.apply(lambda row: detect_pattern(row.name,backcandles=60,window=9),axis=1)
        
    pattern_list = df[df['pattern']!=0]
        
    return df[df['pattern']!=0]

# def pattern(df):
#     df.rename(columns = {'Open':'open','High':'high','Low':'low','Adj Close':'close','Volume':'volume'}, inplace =True)
#     df['EMA'] = ta.ema(df.close,length=150)
    
#     EMAsignal = [0]*len(df)
#     backcandles= 15 

#     for row in range(backcandles,len(df)):
#         upt=1
#         dnt=1
#         for i in range(row-backcandles,row+1):
#             if max(df.open[i],df.close[i])>=df.EMA[i]:
#                 dnt=0
#             if min(df.open[i],df.close[i])<=df.EMA[i]:
#                 upt=0
#         if upt==1 and dnt==1 :
#             EMAsignal[row]=3
#         elif upt==1:
#             EMAsignal[row]=2
#         elif dnt==1:
#             EMAsignal[row]=1
#     df['EMAsignal'] = EMAsignal
    
#     def isPivot(candle,window):
#         if candle-window <0 or candle+window>=len(df):
#             return 0

#         pivotHigh=1
#         pivotLow=2
#         for i in range(candle-window,candle+window+1):
#             if df.iloc[candle].low > df.iloc[i].low:
#                 pivotLow=0
#             if df.iloc[candle].high < df.iloc[i].high:
#                 pivotHigh=0
#         if( pivotHigh and pivotLow):
#             return 3
#         elif pivotHigh:
#             return pivotHigh
#         elif pivotLow:
#             return pivotLow
#         else:
#             return 0
        
#     window =10 
#     df['isPivot'] = df.apply(lambda x: isPivot(x.name,window),axis=1)
    
#     def pointposition(x):
#         if x['isPivot']==2:
#             return x['low']-1e-3
#         elif x['isPivot']==1:
#             return x['high']+1e-3
#         else:
#             return np.nan
#     df['pointposition'] = df.apply(lambda row:pointposition(row),axis=1)
    
#     def detect_pattern(candle,backcandles,window):
#         if(candle<=(backcandles+window)) or (candle+window+1 >= len(df)):
#             return 0
#         localdf = df.iloc[candle-backcandles-window:candle-window]
#         highs = localdf[localdf['isPivot']==1].high.tail(3).values
#         lows = localdf[localdf['isPivot']==2].low.tail(3).values
#         cmp= localdf['Close'].values
#         levelbreak = 0
#         zone_width = cmp.mean()*0.05
#         if len(lows)==3:
#             support_condition = True
#             mean_low = lows.mean()
#             for low in lows:
#                 if abs(low-mean_low)>zone_width:
#                     support_condition =False
#                     break
#             if support_condition and (mean_low - df.iloc[candle].close)> zone_width*2 and df.iloc[candle].EMAsignal==1:
#                 levelbreak=1
                
#         if len(highs)==3:
#             resistance_condition = True
#             mean_high = highs.mean()
#             for high in highs:
#                 if abs(high-mean_high)>  zone_width:
#                     resistance_condition =False
#                     break
#             if resistance_condition and (df.iloc[candle].close - mean_high)> zone_width*2 and df.iloc[candle].EMAsignal==2:
#                 levelbreak=2
#         return levelbreak
    
#     df['pattern'] = df.apply(lambda row: detect_pattern(row.name,backcandles=60,window=9),axis=1)
        
#     pattern_list=df[df['pattern']!=0]
#     return pattern_list

if __name__=='__main__':
    pattern.run(debug=True)

# import pandas
# print(pandas.__version__)
