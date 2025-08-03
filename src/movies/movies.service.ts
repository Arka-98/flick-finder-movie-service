import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { Model, Types } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Showtime } from 'src/showtime/schemas/showtime.schema';
import { KafkaService, TOPICS } from '@flick-finder/common';
import { CreateShowtimeDto } from '@apps/showtime/dto/create-showtime.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createMovie(movie: CreateMovieDto) {
    const createdMovie = await this.movieModel.create(movie);

    this.kafkaService.emit(TOPICS.MOVIE.CREATED, {
      key: createdMovie.id,
      value: createdMovie.toObject(),
    });

    return createdMovie;
  }

  async findMovieById(id: Types.ObjectId) {
    return this.movieModel.findById(id);
  }

  async findAllMovies() {
    return this.movieModel.find();
  }

  async findMovieByUserId(userId: string) {
    return this.movieModel.find({});
  }

  async updateMovie(id: Types.ObjectId, movie: CreateMovieDto) {
    const updatedMovie = await this.movieModel.findByIdAndUpdate(id, {
      $set: movie,
    });

    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }

    this.kafkaService.emit(TOPICS.MOVIE.UPDATED, {
      key: id.toString(),
      value: updatedMovie.toObject(),
    });

    return updatedMovie;
  }

  async deleteMovie(id: Types.ObjectId) {
    const deletedMovie = await this.movieModel.findByIdAndDelete(id);

    if (!deletedMovie) {
      throw new NotFoundException('Movie not found');
    }

    this.kafkaService.emit(TOPICS.MOVIE.DELETED, {
      key: id.toString(),
      value: id.toString(),
    });

    return deletedMovie;
  }

  getShowtimesByMovieId(movieId: Types.ObjectId) {
    return this.showtimeModel.find({ movie: movieId });
  }

  async createShowtimeByMovieId(
    movieId: Types.ObjectId,
    { hall, showtime }: CreateShowtimeDto,
  ) {
    const createdShowtime = await this.showtimeModel.create({
      movie: movieId,
      hall,
      showtime,
    });

    this.kafkaService.emit(TOPICS.SHOWTIME.CREATED, {
      key: createdShowtime.id,
      value: createdShowtime.toObject(),
    });

    return createdShowtime;
  }
}
