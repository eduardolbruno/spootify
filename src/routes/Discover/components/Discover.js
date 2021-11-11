import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';

import api from "./../../../config";
import axios from 'axios';
import qs from 'qs';

// obtain spotify auth token using credentials 
export const getAuth = async () => {
  const clientId = api.api.clientId;
  const clientSecret = api.api.clientSecret;
  
  // payload
  const headers = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  };
  const data = {
    grant_type: 'client_credentials',
  };

  //console.log(api)
  try {
    const response = await axios.post(
      api.api.authUrl,
      qs.stringify(data),
      headers
    );

    // return access token
    return response.data.access_token;

  } catch (error) {
    console.log(error);
  }
};

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  getReleases = async () => {

    // request token using getAuth() function
    const access_token = await getAuth();
  
    const api_url = `https://api.spotify.com/v1/browse/new-releases`;
  
    try{
      const response = await axios.get(api_url, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      let data = response.data.albums.items;
      
      // update state
      this.setState({newReleases: data})

    }catch(error){
      console.log(error);
    }  
  };

  getFeatured = async () => {

    //request token using getAuth() function
    const access_token = await getAuth();
  
    const api_url = `https://api.spotify.com/v1/browse/featured-playlists`;
  
    try{
      const response = await axios.get(api_url, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      //console.log(response.data);
      let data = response.data.playlists.items;
      
      // update state
      this.setState({playlists: data})
  
    }catch(error){
      console.log(error);
    }  
  };

  getCategories = async () => {

    //request token using getAuth() function
    const access_token = await getAuth();
  
    const api_url = `https://api.spotify.com/v1/browse/categories`;
  
    try{
      const response = await axios.get(api_url, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      //console.log(response.data);
      let data = response.data.categories.items;

      // update state
      this.setState({categories: data})
  
    }catch(error){
      console.log(error);
    }  
  };

  componentDidMount() {   

    // get data for each section
    this.getReleases();
    this.getFeatured();
    this.getCategories();
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
