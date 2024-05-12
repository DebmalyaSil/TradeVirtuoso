import numpy as np
from pandas_datareader import data as pdr
import datetime as dt
import mplfinance as mpf
import yfinance as yf
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import pandas_ta as ta
import plotly.graph_objects as go
import plotly.express as px


start = dt.datetime(2010,1,1)
end = dt.datetime.today()

st.title('Prediction')
user_input = st.text_input('Enter Stock Ticker','SBIN.NS')

yf.pdr_override()
df = pdr.get_data_yahoo(user_input,start,end)

st.subheader(f'Data from {start} to {end}')
st.write(df.describe())

st.title("Stock Infornmation")
# dfchart = df['Adj Close']
ticker = yf.Ticker(user_input)
data=pd.Series(ticker.info)
dict1 = ['industry','sector','previousClose','open','dayLow','dayHigh','dividendYield','beta','trailingPE','forwardPE','marketCap','fiftyTwoWeekLow','fiftyTwoWeekHigh']
data1 = data[dict1]
# st.table(data)
st.dataframe(data1,use_container_width=True)

st.header('Closing Price vs Time Chart')
# fig=plt.figure(figsize=(16,8))
# colors = mpf.make_marketcolors(up="#00ff00",down="#ff0000",wick="inherit",edge="inherit",volume="in")
# mpf_style = mpf.make_mpf_style(base_mpf_style='nightclouds',marketcolors=colors)
# fig, ax = mpf.plot(df,type='candle',style=mpf_style,volume=True,mav=(50,100,200),figsize=(16,8),returnfig=True)
# st.pyplot(fig)
df['20day_moving_avg'] = df['Adj Close'].rolling(window=20).mean()
df['100day_moving_avg'] = df['Adj Close'].rolling(window=100).mean()

fig = go.Figure()
fig.add_trace(go.Scatter(x=df.index, y=df['Adj Close'], mode='lines', name='Closing Price'))
for window in [20,100]:  # You can add more window sizes here
    fig.add_trace(go.Scatter(x=df.index, y=df[f'{window}day_moving_avg'],mode='lines', name=f'{window}-day Moving Avg'))

fig.update_xaxes(
    rangeslider_visible=True,
    rangeselector=dict(
        buttons=list([
            dict(count=1, label="1M", step="month", stepmode="backward"),
            dict(count=6, label="6M", step="month", stepmode="backward"),
            dict(count=1, label="YTD", step="year", stepmode="todate"),
            dict(count=1, label="1Y", step="year", stepmode="backward"),
            dict(count=5, label="5Y", step="year", stepmode="backward"),
            dict(step="all")
        ])
    )
)
st.plotly_chart(fig)


import lstmpred
y_pred,y_test = lstmpred.lstmpred(df)

#prediction graph
st.subheader('Predictions vs Original')
fig4= plt.figure(figsize=(16,8))
plt.plot(y_test,'b' , label='Original Price')
plt.plot(y_pred, 'r' , label ='Predicted Price')
plt.xlabel('Time')
plt.ylabel('Price')
plt.legend()
st.pyplot(fig4)

import breakout

pattern_list = breakout.pattern(df)
st.dataframe(pattern_list)

st.title('Breakout Recognition')
user_input = st.text_input('Enter Stock Ticker','100')

dfpl=df[min(0,int(user_input)-100):int(user_input)+50]

fig = go.Figure(data=[go.Candlestick(x=dfpl.index,open=dfpl['open'],high=dfpl['high'],low=dfpl['low'],close=dfpl['Close'])])
fig.add_scatter(x=dfpl.index,y=dfpl['pointposition'],mode="markers",marker=dict(size=5,color="Yellow"),name="Pivot")

fig.update_layout(xaxis_rangeslider_visible=False)
# fig.show()
# Create a border around the plot and set paper_bgcolor to light red
fig.update_layout(
    paper_bgcolor="#FFCCCB",
)

st.plotly_chart(fig, use_container_width=True)


