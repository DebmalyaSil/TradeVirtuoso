import numpy as np
from pandas_datareader import data as pdr
import datetime as dt
import mplfinance as mpf
import yfinance as yf
import pandas as pd
import pandas_ta as pa

def lstmpred(df):
    df=df[df['Volume']!=0]
    df.reset_index(drop=True, inplace=True)
    
    # Adding indicators
    df['RSI']=pa.rsi(df.Close, length=15)
    df['EMAF']=pa.ema(df.Close, length=20)
    df['EMAM']=pa.ema(df.Close, length=100)
    df['EMAS']=pa.ema(df.Close, length=150)
    df["ATR"] = pa.atr(df.High, df.Low, df.Close, length=16)
    df["WPR"] = pa.willr(df.High, df.Low, df.Close, length=16)
    a = pa.macd(df.Close)
    df = df.join(a)
    df['Target'] = df['Close']-df.Open
    df['Target'] = df['Target'].shift(-1)

    df['TargetClass'] = [1 if df.Target[i]>0 else 0 for i in range(len(df))]

    df['TargetNextClose'] = df['Adj Close'].shift(-1)

    df.dropna(inplace=True)
    df.reset_index(inplace = True)
    df.drop(['Volume', 'Close','index','Low','High','Open'], axis=1, inplace=True)

    df.dropna(inplace=True)
    
    from sklearn.preprocessing import MinMaxScaler
    sc = MinMaxScaler(feature_range=(0,1))
    sc2 = MinMaxScaler(feature_range=(0,1))
    test_split = df[:]
    test_split = sc.fit_transform(test_split)
    # print(train_split)
    
    X_test = []
    backcandles = 30
    print(test_split.shape[0])
    for j in range(8):#data_set_scaled[0].size):#2 columns are target not X
        X_test.append([])
        for i in range(backcandles, test_split.shape[0]):#backcandles+2
            X_test[j].append(test_split[i-backcandles:i, j])

    #move axis from 0 to position 2
    X_test=np.moveaxis(X_test, [0], [2])

    X_test=np.array(X_test)
    
    # y_train=df.iloc[30:splitlimit,0].values
    y_test=df.iloc[30:,0].values
    # y_train = y_train.reshape(len(y_train),1)
    y_test = y_test.reshape(len(y_test),1)
    # y_train = sc2.fit_transform(y_train)
    y_test = sc2.fit_transform(y_test)
    
    from tensorflow.keras.models import load_model
    model = load_model('model')
    
    y_pred = model.predict(X_test)
    #y_pred=np.where(y_pred > 0.43, 1,0)
    
    return (sc2.inverse_transform(y_pred),sc2.inverse_transform(y_test))

if __name__ == '__main__':
    lstmpred.run(debug=True)
        
        
