"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card,CardContent,CardDescription,CardTitle,CardHeader } from '@/components/ui/card';

import { AlertCircle } from 'lucide-react';

const HealthInfoEdit = () => {
  const [queueId, setQueueId] = useState<string>('');
  const [ehrData, setEhrData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch EHR data based on queue ID
  const fetchEhrData = async () => {
    if (!queueId.trim()) {
      setError('Please enter a valid Queue ID');
      return;
    }

    setLoading(true);
    setError('');
    setEhrData(null);

    const { data, error: fetchError } = await supabase
      .from('ehr_data')
      .select('ehrData')
      .eq('queue_id', queueId)
      .single();

    if (fetchError) {
      setError(`Error fetching data: ${fetchError.message}`);
      setLoading(false);
      return;
    }

    if (!data || !data.ehrData) {
      setError(`No data found for Queue ID ${queueId}`);
      setLoading(false);
      return;
    }

    setEhrData(data.ehrData);
    setLoading(false);
    setIsEditing(false);
  };

  // Handle input changes (previous method remains the same)
  const handleInputChange = (section: string, key: string, value: any, index?: number) => {
    const updatedEhrData = { ...ehrData };

    if (Array.isArray(updatedEhrData[section])) {
      const updatedArray = [...updatedEhrData[section]];
      if (index !== undefined) {
        updatedArray[index] = value;
      }
      updatedEhrData[section] = updatedArray;
    } else if (typeof updatedEhrData[section] === 'object' && updatedEhrData[section] !== null) {
      const updatedSection = { ...updatedEhrData[section] };
      updatedSection[key] = value;
      updatedEhrData[section] = updatedSection;
    } else {
      updatedEhrData[section] = value;
    }

    setEhrData(updatedEhrData);
  };

  // Save updated data
  const handleSave = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('ehr_data')
      .update({ ehrData: ehrData })
      .eq('queue_id', queueId);

    if (error) {
      setError(`Error updating data: ${error.message}`);
      setLoading(false);
      return;
    }

    setIsEditing(false);
    setLoading(false);
  };

  // Add new item to array fields (previous method remains the same)
  const handleAddItem = (section: string) => {
    const updatedEhrData = { ...ehrData };
    const newItem = section === 'personal_history'
      ? { type: '', description: '' }
      : section === 'family_history'
        ? { relation: '', condition: '' }
        : '';

    if (!updatedEhrData[section]) {
      updatedEhrData[section] = [];
    }

    updatedEhrData[section].push(newItem);
    setEhrData(updatedEhrData);
  };

  // Remove item from array fields (previous method remains the same)
  const handleRemoveItem = (section: string, index: number) => {
    const updatedEhrData = { ...ehrData };
    updatedEhrData[section].splice(index, 1);
    setEhrData(updatedEhrData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 w-screen">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Electronic Health Record Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex space-x-2">
            <Input
              placeholder="Enter Queue ID"
              value={queueId}
              onChange={(e) => setQueueId(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={fetchEhrData} 
              disabled={loading}
              className="bg-blue-500"
            >
              {loading ? 'Fetching...' : 'Fetch Data'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {ehrData && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Queue ID: {queueId}
                </h2>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "bg-gray-500" : "bg-blue-500"}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Age"
                      value={ehrData.ehrData.age || ''}
                      onChange={(e) => handleInputChange('ehrData', 'age', e.target.value)}
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="Prefix"
                      value={ehrData.ehrData.name?.prefix || ''}
                      onChange={(e) => handleInputChange('name', 'prefix', e.target.value)}
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="First Name"
                      value={ehrData.ehrData.name?.firstname || ''}
                      onChange={(e) => handleInputChange('name', 'firstname', e.target.value)}
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="Surname"
                      value={ehrData.ehrData.name?.surname || ''}
                      onChange={(e) => handleInputChange('name', 'surname', e.target.value)}
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="Gender"
                      value={ehrData.ehrData.gender || ''}
                      onChange={(e) => handleInputChange('ehrData', 'gender', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Past Illness Section */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2">Past Illness</h2>
                    {isEditing && (
                      <Button
                        onClick={() => handleAddItem('past_illness')}
                        className="bg-green-500 h-8"
                      >
                        + Add Illness
                      </Button>
                    )}
                  </div>
                  {ehrData.ehrData.past_illness?.map((illness: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={illness}
                        onChange={(e) => handleInputChange('past_illness', '', e.target.value, index)}
                        disabled={!isEditing}
                        className="flex-grow"
                      />
                      {isEditing && (
                        <Button
                          onClick={() => handleRemoveItem('past_illness', index)}
                          className="bg-red-500 h-8"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Family History Section */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2">Family History</h2>
                    {isEditing && (
                      <Button
                        onClick={() => handleAddItem('family_history')}
                        className="bg-green-500 h-8"
                      >
                        + Add Family History
                      </Button>
                    )}
                  </div>
                  {ehrData.ehrData.family_history?.map((history: { relation: string, condition: string }, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Relation"
                        value={history.relation}
                        onChange={(e) => {
                          const updatedHistory = [...ehrData.ehrData.family_history];
                          updatedHistory[index] = {
                            ...updatedHistory[index],
                            relation: e.target.value
                          };
                          handleInputChange('ehrData', 'family_history', updatedHistory);
                        }}
                        disabled={!isEditing}
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Condition"
                          value={history.condition}
                          onChange={(e) => {
                            const updatedHistory = [...ehrData.ehrData.family_history];
                            updatedHistory[index] = {
                              ...updatedHistory[index],
                              condition: e.target.value
                            };
                            handleInputChange('ehrData', 'family_history', updatedHistory);
                          }}
                          disabled={!isEditing}
                          className="flex-grow"
                        />
                        {isEditing && (
                          <Button
                            onClick={() => handleRemoveItem('family_history', index)}
                            className="bg-red-500 h-8"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chief Complaints Section */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2">Chief Complaints</h2>
                    {isEditing && (
                      <Button
                        onClick={() => handleAddItem('chief_complaint')}
                        className="bg-green-500 h-8"
                      >
                        + Add Complaint
                      </Button>
                    )}
                  </div>
                  {ehrData.ehrData.chief_complaint?.map((complaint: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Textarea
                        placeholder="Enter complaint"
                        value={complaint}
                        onChange={(e) => handleInputChange('chief_complaint', '', e.target.value, index)}
                        disabled={!isEditing}
                        className="flex-grow"
                      />
                      {isEditing && (
                        <Button
                          onClick={() => handleRemoveItem('chief_complaint', index)}
                          className="bg-red-500 h-8"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Present Illness Section */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2">Present Illness</h2>
                    {isEditing && (
                      <Button
                        onClick={() => handleAddItem('present_illness')}
                        className="bg-green-500 h-8"
                      >
                        + Add Illness
                      </Button>
                    )}
                  </div>
                  {ehrData.ehrData.present_illness?.map((illness: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Textarea
                        placeholder="Enter present illness details"
                        value={illness}
                        onChange={(e) => handleInputChange('present_illness', '', e.target.value, index)}
                        disabled={!isEditing}
                        className="flex-grow"
                      />
                      {isEditing && (
                        <Button
                          onClick={() => handleRemoveItem('present_illness', index)}
                          className="bg-red-500 h-8"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Personal History Section */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2">Personal History</h2>
                    {isEditing && (
                      <Button
                        onClick={() => handleAddItem('personal_history')}
                        className="bg-green-500 h-8"
                      >
                        + Add History
                      </Button>
                    )}
                  </div>
                  {ehrData.ehrData.personal_history?.map((history: { type: string, description: string }, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="History Type"
                        value={history.type}
                        onChange={(e) => {
                          const updatedHistory = [...ehrData.ehrData.personal_history];
                          updatedHistory[index] = {
                            ...updatedHistory[index],
                            type: e.target.value
                          };
                          handleInputChange('ehrData', 'personal_history', updatedHistory);
                        }}
                        disabled={!isEditing}
                      />
                      <div className="flex items-center space-x-2">
                        <Textarea
                          placeholder="Description"
                          value={history.description}
                          onChange={(e) => {
                            const updatedHistory = [...ehrData.ehrData.personal_history];
                            updatedHistory[index] = {
                              ...updatedHistory[index],
                              description: e.target.value
                            };
                            handleInputChange('ehrData', 'personal_history', updatedHistory);
                          }}
                          disabled={!isEditing}
                          className="flex-grow"
                        />
                        {isEditing && (
                          <Button
                            onClick={() => handleRemoveItem('personal_history', index)}
                            className="bg-red-500 h-8"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* More sections would be similar... */}
                {isEditing && (
                  <Button
                    onClick={handleSave}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthInfoEdit;