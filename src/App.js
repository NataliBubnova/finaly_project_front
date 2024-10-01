import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
    const API_KEY = "607e2c25036e42b2bdd1e928368d6364";
    const BASE_URL = "https://newsapi.org/v2/";
    const [articles, setArticles] = useState([]);
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [requestCount, setRequestCount] = useState(() => {
        return parseInt(localStorage.getItem('requestCount')) || 0;
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let url = `${BASE_URL}top-headlines?country=us`;
            if (category !== 'all') {
                url += `&category=${category}`;
            }
            if (searchQuery) {
                url += `&q=${encodeURIComponent(searchQuery)}`;
            }

            try {
                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${API_KEY}` }
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const jsonData = await response.json();
                setArticles(jsonData.articles);
                
                const newRequestCount = requestCount + 1;
                setRequestCount(newRequestCount);
                localStorage.setItem('requestCount', newRequestCount);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category, searchQuery]);

    const dayAgo = (datePublished) => {
        const diff = new Date() - new Date(datePublished);
        return Math.floor(diff / 86400000);
    };

    const checkAuthor = (author) => author ? author : "unknown";

    function handleCategoryChange(cat) {
        setCategory(cat);
    }

    return (
        <>
            <Navbar fixed="top" bg="dark">
        <Container fluid= 'sm' className='d-block'>
            <h1 className="text-center" style={{color: '#f8f9fa' }}>Select a news category</h1>
                <Nav className="d-flex justify-content-between">
                    <Button variant='primary' onClick={() => handleCategoryChange('entertainment')}>Entertainment</Button>{' '}
                    <Button variant='primary' onClick={() => handleCategoryChange('sport')}>Sport</Button>{' '}
                    <Button variant='primary' onClick={() => handleCategoryChange('technology')}>Technology</Button>{' '}
                    <Button variant='primary' onClick={() => handleCategoryChange('science')}>Science</Button>{' '}
                    <Button variant='primary' onClick={() => handleCategoryChange('business')}>Business</Button>{' '}
                </Nav>
                    <Form className="d-flex mt-3">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form>
                </Container>
            </Navbar>
            <Container style={{ marginTop: '10rem' }}>
                {loading ? <p>Loading...</p> :
                    <div>
                        <p>Total API requests: {requestCount}</p>
                        <div className="row row-cols-4">
                            {articles.map(item => (
                                <Col key={item.url} className='my-5'>
                                    <Card className='h-100' bg='dark' text='light'>
                                        <Card.Img variant="top" src={item.urlToImage} />
                                        <Card.Body>
                                            <Card.Title>{item.title}</Card.Title>
                                            <Card.Subtitle>{checkAuthor(item.author)}</Card.Subtitle> 
                                            <Card.Text>{item.description}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button href={item.url}>Read more</Button>
                                            <div className='text-center'>{dayAgo(item.publishedAt)} days ago</div>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </div>
                    </div>
                }
            </Container>
        </>
    );
}

export default App;













