import streamlit as st
import pandas as pd

# Get the pandas version
pandas_version = pd.__version__

# Display the version information
st.write(f"Streamlit is using pandas version: {pandas_version}")
