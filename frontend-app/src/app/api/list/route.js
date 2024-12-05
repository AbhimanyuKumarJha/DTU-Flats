import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url); // Get query parameters from the request URL

        // Access query parameters using searchParams
        const name = searchParams.get('name');
        const dateOfBirth = searchParams.get('dateOfBirth');
        const mobileNumber = searchParams.get('mobileNumber');
        const status = searchParams.get('isActive');

        // Construct the filters object
        let filters = {};
        if (name) filters.name = name;
        if (dateOfBirth) filters.dateOfBirth = dateOfBirth;
        if (mobileNumber) filters.mobileNumber = mobileNumber;
        if (status) filters.isActive = status === 'true'; // Convert to boolean if necessary

        // Make the request to the backend API with filters
        const response = await axios.get('http://localhost:3001/api/users', {
            params: filters,
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error submitting form:', error);
        return NextResponse.json({});
    }
}
